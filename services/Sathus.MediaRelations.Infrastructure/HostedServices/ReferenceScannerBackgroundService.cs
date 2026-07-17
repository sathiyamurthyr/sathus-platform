using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Sathus.MediaRelations.Application.DTOs;
using Sathus.MediaRelations.Application.Interfaces;
using Sathus.MediaRelations.Infrastructure.Configuration;
using Sathus.MediaRelations.Infrastructure.Observability;

namespace Sathus.MediaRelations.Infrastructure.HostedServices;

/// <summary>
/// Periodically runs the <see cref="IReferenceScanner"/> to keep the reference index healthy.
/// Disabled by default; enable via configuration. Uses a fresh DI scope per run.
/// </summary>
public sealed class ReferenceScannerBackgroundService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ReferenceScannerOptions _options;
    private readonly MediaRelationsMetrics _metrics;
    private readonly ILogger<ReferenceScannerBackgroundService> _logger;

    public ReferenceScannerBackgroundService(
        IServiceScopeFactory scopeFactory,
        IOptions<ReferenceScannerOptions> options,
        MediaRelationsMetrics metrics,
        ILogger<ReferenceScannerBackgroundService> logger)
    {
        _scopeFactory = scopeFactory;
        _options = options.Value;
        _metrics = metrics;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (!_options.Enabled)
        {
            _logger.LogInformation("Reference scanner background service is disabled.");
            return;
        }

        try
        {
            await Task.Delay(_options.InitialDelay, stoppingToken);
        }
        catch (OperationCanceledException)
        {
            return;
        }

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await RunScanAsync(stoppingToken);
            }
            catch (OperationCanceledException)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Reference scan run failed.");
            }

            try
            {
                await Task.Delay(_options.Interval, stoppingToken);
            }
            catch (OperationCanceledException)
            {
                break;
            }
        }
    }

    private async Task RunScanAsync(CancellationToken cancellationToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var scanner = scope.ServiceProvider.GetRequiredService<IReferenceScanner>();

        var options = new ReferenceScanOptions(
            BatchSize: _options.BatchSize,
            AutoRepair: _options.AutoRepair);

        var report = await scanner.ScanAsync(options, cancellationToken);
        _metrics.ScansCompleted.Add(1);
        _metrics.ScanIssuesFound.Add(report.TotalIssues);
    }
}

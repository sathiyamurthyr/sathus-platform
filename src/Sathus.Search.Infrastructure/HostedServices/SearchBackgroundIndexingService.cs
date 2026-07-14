using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Sathus.Search.Application.Interfaces;

namespace Sathus.Search.Infrastructure.HostedServices;

public sealed class SearchBackgroundIndexingService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<SearchBackgroundIndexingService> _logger;

    public SearchBackgroundIndexingService(IServiceScopeFactory scopeFactory, ILogger<SearchBackgroundIndexingService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var indexer = scope.ServiceProvider.GetRequiredService<ISearchIndexer>();
                var count = await indexer.GetPendingCountAsync(stoppingToken);
                _logger.LogInformation("Search background indexing check: {PendingCount} pending documents", count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in search background indexing service");
            }

            await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
        }
    }
}

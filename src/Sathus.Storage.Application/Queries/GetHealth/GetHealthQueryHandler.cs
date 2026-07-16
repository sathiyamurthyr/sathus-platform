using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Extensions.Logging;
using Sathus.Storage.Application.DTOs;
using Sathus.Storage.Domain.Interfaces;
using Sathus.Storage.Domain.Results;

namespace Sathus.Storage.Application.Queries.GetHealth;

public sealed class GetHealthQueryHandler : IRequestHandler<GetHealthQuery, IReadOnlyList<HealthResponse>>
{
    private readonly IStorageProviderFactory _factory;
    private readonly ILogger<GetHealthQueryHandler> _logger;

    public GetHealthQueryHandler(IStorageProviderFactory factory, ILogger<GetHealthQueryHandler> logger)
    {
        _factory = factory;
        _logger = logger;
    }

    public async Task<IReadOnlyList<HealthResponse>> Handle(GetHealthQuery request, CancellationToken cancellationToken)
    {
        var providers = _factory.GetAllProviders();
        var responses = new List<HealthResponse>();

        foreach (var provider in providers)
        {
            var sw = Stopwatch.StartNew();
            try
            {
                await provider.GetMetadataAsync(string.Empty, cancellationToken);
                sw.Stop();
                responses.Add(new HealthResponse(provider.ProviderName, true, $"{sw.ElapsedMilliseconds}ms", null, DateTimeOffset.UtcNow));
            }
            catch (Exception ex)
            {
                sw.Stop();
                _logger.LogWarning(ex, "Health check failed for provider {Provider}", provider.ProviderName);
                responses.Add(new HealthResponse(provider.ProviderName, false, $"{sw.ElapsedMilliseconds}ms", ex.Message, DateTimeOffset.UtcNow));
            }
        }

        return responses;
    }
}

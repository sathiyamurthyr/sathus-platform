using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Extensions.Logging;
using Sathus.Storage.Application.DTOs;
using Sathus.Storage.Domain.Interfaces;
using Sathus.Storage.Domain.Results;

namespace Sathus.Storage.Application.Queries.GetProviders;

public sealed class GetProvidersQueryHandler : IRequestHandler<GetProvidersQuery, IReadOnlyList<ProviderResponse>>
{
    private readonly IStorageProviderFactory _factory;
    private readonly ILogger<GetProvidersQueryHandler> _logger;

    public GetProvidersQueryHandler(IStorageProviderFactory factory, ILogger<GetProvidersQueryHandler> logger)
    {
        _factory = factory;
        _logger = logger;
    }

    public async Task<IReadOnlyList<ProviderResponse>> Handle(GetProvidersQuery request, CancellationToken cancellationToken)
    {
        var providers = _factory.GetAllProviders();
        var responses = new List<ProviderResponse>();

        foreach (var provider in providers)
        {
            StorageHealth health = default;
            try
            {
                health = await provider.GetMetadataAsync(string.Empty, cancellationToken) is object
                    ? new StorageHealth(provider.ProviderName, true)
                    : new StorageHealth(provider.ProviderName, false, "Empty response");
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Health check failed for provider {Provider}", provider.ProviderName);
                health = new StorageHealth(provider.ProviderName, false, ex.Message);
            }

            responses.Add(new ProviderResponse(
                provider.ProviderName,
                provider.ProviderType,
                provider == _factory.GetDefaultProvider(),
                provider.Location,
                health.IsHealthy));
        }

        return responses;
    }
}

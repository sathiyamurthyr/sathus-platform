using Microsoft.Extensions.Logging;
using Sathus.Storage.Domain.Interfaces;
using Sathus.Storage.Domain.Results;
using Sathus.Storage.Infrastructure.Configuration;
using Sathus.Storage.Infrastructure.Factory;

namespace Sathus.Storage.Infrastructure.Factory;

public sealed class StorageProviderFactory : IStorageProviderFactory
{
    private readonly StorageProviderRegistry _registry;
    private readonly ILogger<StorageProviderFactory> _logger;

    public StorageProviderFactory(StorageProviderRegistry registry, ILogger<StorageProviderFactory> logger)
    {
        _registry = registry;
        _logger = logger;
    }

    public IStorageProvider Resolve(string? name = null)
    {
        return string.IsNullOrWhiteSpace(name)
            ? _registry.GetDefaultProvider()
            : _registry.Resolve(name);
    }

    public IReadOnlyList<IStorageProvider> GetAllProviders() => _registry.GetAllProviders();

    public IStorageProvider GetDefaultProvider() => _registry.GetDefaultProvider();
}

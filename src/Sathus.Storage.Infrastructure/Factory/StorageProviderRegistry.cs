using Microsoft.Extensions.Logging;
using Sathus.Storage.Domain.Enums;
using Sathus.Storage.Domain.Interfaces;
using Sathus.Storage.Domain.Results;
using Sathus.Storage.Infrastructure.Configuration;
using Sathus.Storage.Infrastructure.Providers;

namespace Sathus.Storage.Infrastructure.Factory;

public sealed class StorageProviderRegistry
{
    private readonly List<IStorageProvider> _providers = new();
    private IStorageProvider? _defaultProvider;
    private readonly ILogger<StorageProviderRegistry> _logger;

    public StorageProviderRegistry(ILogger<StorageProviderRegistry> logger)
    {
        _logger = logger;
    }

    public void RegisterProvider(IStorageProvider provider)
    {
        ArgumentNullException.ThrowIfNull(provider);

        if (_providers.Any(p => p.ProviderName.Equals(provider.ProviderName, StringComparison.OrdinalIgnoreCase)))
            throw new InvalidStorageConfigurationException(provider.ProviderName, "Provider is already registered.");

        _providers.Add(provider);
        _logger.LogInformation("Registered storage provider '{Provider}' of type {Type}.", provider.ProviderName, provider.ProviderType);
    }

    public void SetDefaultProvider(string name)
    {
        var provider = _providers.FirstOrDefault(p => p.ProviderName.Equals(name, StringComparison.OrdinalIgnoreCase))
            ?? throw new InvalidStorageConfigurationException(name, "Default provider not found in registered providers.");

        _defaultProvider = provider;
        _logger.LogInformation("Set default storage provider to '{Provider}'.", name);
    }

    public IReadOnlyList<IStorageProvider> GetAllProviders() => _providers;

    public IStorageProvider GetDefaultProvider() => _defaultProvider ?? throw new InvalidStorageConfigurationException("default", "No default storage provider is configured.");

    public IStorageProvider? Resolve(string? name = null)
    {
        if (string.IsNullOrWhiteSpace(name))
            return GetDefaultProvider();

        return _providers.FirstOrDefault(p => p.ProviderName.Equals(name, StringComparison.OrdinalIgnoreCase))
            ?? throw new InvalidStorageConfigurationException(name, "Provider not found.");
    }
}

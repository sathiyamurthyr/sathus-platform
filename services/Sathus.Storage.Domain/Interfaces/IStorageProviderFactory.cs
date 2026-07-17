using Sathus.Storage.Domain.ValueObjects;

namespace Sathus.Storage.Domain.Interfaces;

public interface IStorageProviderFactory
{
    IStorageProvider Resolve(string? name = null);
    IReadOnlyList<IStorageProvider> GetAllProviders();
    IStorageProvider GetDefaultProvider();
}

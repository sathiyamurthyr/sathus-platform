using Sathus.Processing.Application.Interfaces;
using Sathus.Storage.Domain.Interfaces;

namespace Sathus.Processing.Infrastructure.Services;

/// <summary>
/// Opens the stored asset stream via the storage provider abstraction.
/// </summary>
public sealed class StorageAssetSourceProvider : IAssetSourceProvider
{
    private readonly IStorageProviderFactory _factory;

    public StorageAssetSourceProvider(IStorageProviderFactory factory)
    {
        _factory = factory;
    }

    public async Task<Stream> OpenAsync(string storageKey, CancellationToken cancellationToken = default)
    {
        var provider = _factory.GetDefaultProvider();
        var (stream, result) = await provider.DownloadAsync(storageKey, cancellationToken);

        if (!result.Succeeded || stream is null)
        {
            throw new AssetProcessingException($"Unable to open asset '{storageKey}': {result.Error}");
        }

        return stream;
    }
}

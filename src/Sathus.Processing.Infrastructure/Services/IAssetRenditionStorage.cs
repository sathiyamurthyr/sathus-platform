using Sathus.Processing.Domain.ValueObjects;
using Sathus.Storage.Domain.Interfaces;

namespace Sathus.Processing.Infrastructure.Services;

/// <summary>
/// Persists generated renditions (thumbnails, derivatives, blur placeholders) back to
/// the storage provider and returns the resulting <see cref="Rendition"/> descriptor.
/// </summary>
public interface IAssetRenditionStorage
{
    Task<Rendition> StoreAsync(
        RenditionKind kind,
        string format,
        string storageKey,
        Stream data,
        int? width,
        int? height,
        CancellationToken cancellationToken = default);
}

public sealed class StorageRenditionStorage : IAssetRenditionStorage
{
    private readonly IStorageProviderFactory _factory;

    public StorageRenditionStorage(IStorageProviderFactory factory)
    {
        _factory = factory;
    }

    public async Task<Rendition> StoreAsync(
        RenditionKind kind,
        string format,
        string storageKey,
        Stream data,
        int? width,
        int? height,
        CancellationToken cancellationToken = default)
    {
        var contentType = format switch
        {
            "png" => "image/png",
            "webp" => "image/webp",
            "avif" => "image/avif",
            "jpg" or "jpeg" => "image/jpeg",
            "gif" => "image/gif",
            _ => $"image/{format}"
        };

        data.Position = 0;
        var provider = _factory.GetDefaultProvider();
        var result = await provider.UploadAsync(storageKey, data, contentType: contentType, cancellationToken: cancellationToken);

        if (!result.Succeeded)
        {
            throw new AssetProcessingException($"Failed to store rendition '{storageKey}': {result.Error}");
        }

        var sizeBytes = data.CanSeek ? data.Length : 0;
        return Rendition.Create(kind, format, sizeBytes, storageKey, width, height);
    }
}

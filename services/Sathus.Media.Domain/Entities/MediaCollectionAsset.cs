using Sathus.SharedKernel.Entities;

namespace Sathus.Media.Domain.Entities;

/// <summary>
/// Join entity associating a collection with an asset, preserving ordering.
/// </summary>
public sealed class MediaCollectionAsset : Entity
{
    public Guid CollectionId { get; private set; }
    public Guid AssetId { get; private set; }
    public int SortOrder { get; private set; }

    public MediaCollection? Collection { get; set; }
    public MediaAsset? Asset { get; set; }

    private MediaCollectionAsset()
    {
    }

    public MediaCollectionAsset(Guid collectionId, Guid assetId, int sortOrder = 0)
    {
        CollectionId = collectionId;
        AssetId = assetId;
        SortOrder = sortOrder;
    }
}

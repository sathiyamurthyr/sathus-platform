using Sathus.SharedKernel.Entities;

namespace Sathus.Media.Domain.Entities;

/// <summary>
/// Join entity associating an asset with a tag.
/// </summary>
public sealed class MediaAssetTag : Entity
{
    public Guid AssetId { get; private set; }
    public Guid TagId { get; private set; }

    public MediaAsset? Asset { get; set; }
    public MediaTag? Tag { get; set; }

    private MediaAssetTag()
    {
    }

    public MediaAssetTag(Guid assetId, Guid tagId)
    {
        AssetId = assetId;
        TagId = tagId;
    }
}

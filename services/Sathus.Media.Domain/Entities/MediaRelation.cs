using Sathus.Media.Domain.Enums;
using Sathus.SharedKernel.Entities;

namespace Sathus.Media.Domain.Entities;

/// <summary>
/// Expresses a directed relationship between two assets (e.g. variant, translation).
/// </summary>
public sealed class MediaRelation : Entity
{
    public Guid SourceAssetId { get; private set; }
    public Guid TargetAssetId { get; private set; }
    public RelationType RelationType { get; private set; }
    public Guid? RelatedBy { get; private set; }

    public MediaAsset? SourceAsset { get; set; }
    public MediaAsset? TargetAsset { get; set; }

    private MediaRelation()
    {
    }

    public MediaRelation(Guid sourceAssetId, Guid targetAssetId, RelationType relationType, Guid? createdBy = null)
    {
        if (sourceAssetId == targetAssetId)
        {
            throw new ArgumentException("An asset cannot be related to itself.", nameof(targetAssetId));
        }

        Id = Guid.NewGuid();
        SourceAssetId = sourceAssetId;
        TargetAssetId = targetAssetId;
        RelationType = relationType;
        RelatedBy = createdBy;
        SetCreationAudit(createdBy, DateTime.UtcNow);
    }
}

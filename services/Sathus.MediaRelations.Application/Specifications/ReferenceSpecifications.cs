using Sathus.MediaRelations.Domain.Entities;
using Sathus.MediaRelations.Domain.Enums;
using Sathus.SharedKernel.Specifications;

namespace Sathus.MediaRelations.Application.Specifications;

/// <summary>Active references for a given asset, ordered by most recently updated.</summary>
public sealed class ActiveReferencesForAssetSpecification : Specification<MediaReference>
{
    public ActiveReferencesForAssetSpecification(Guid assetId)
    {
        AddCriteria(r => r.AssetId == assetId && r.Status == ReferenceStatus.Active);
        ApplyOrderByDescending(r => r.UpdatedAt);
    }
}

/// <summary>All broken references, paged, ordered by when they were last validated.</summary>
public sealed class BrokenReferencesSpecification : Specification<MediaReference>
{
    public BrokenReferencesSpecification(int skip, int take)
    {
        AddCriteria(r => r.Status == ReferenceStatus.Broken);
        ApplyOrderByDescending(r => r.UpdatedAt);
        ApplyPaging(skip, take);
    }
}

/// <summary>References originating from a specific content item.</summary>
public sealed class ReferencesFromSourceSpecification : Specification<MediaReference>
{
    public ReferencesFromSourceSpecification(string referenceType, string sourceReferenceId)
    {
        var type = referenceType.Trim().ToLowerInvariant();
        AddCriteria(r =>
            r.ReferenceType.Value == type &&
            r.SourceReferenceId.Value == sourceReferenceId &&
            r.Status != ReferenceStatus.Removed);
        ApplyOrderBy(r => r.Path.Value);
    }
}

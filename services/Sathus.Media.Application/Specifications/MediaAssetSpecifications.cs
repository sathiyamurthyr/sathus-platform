using Sathus.Media.Domain.Entities;
using Sathus.Media.Domain.Enums;
using Sathus.SharedKernel.Specifications;

namespace Sathus.Media.Application.Specifications;

/// <summary>
/// Loads a single asset together with its tags, usages, versions and metadata.
/// </summary>
public sealed class MediaAssetDetailSpecification : Specification<MediaAsset>
{
    public MediaAssetDetailSpecification(Guid id)
    {
        AddCriteria(a => a.Id == id);
        AddInclude(a => a.Tags);
        AddInclude("Tags.Tag");
        AddInclude(a => a.Usages);
        AddInclude(a => a.Versions);
        AddInclude(a => a.Metadata);
    }
}

/// <summary>
/// Filters and pages the asset catalogue.
/// </summary>
public sealed class MediaAssetFilterSpecification : Specification<MediaAsset>
{
    public MediaAssetFilterSpecification(
        Guid? folderId = null,
        string? type = null,
        MediaStatus? status = null,
        Guid? tagId = null,
        string? term = null,
        int skip = 0,
        int take = 25)
    {
        if (folderId.HasValue)
        {
            AddCriteria(a => a.FolderId == folderId);
        }

        if (!string.IsNullOrWhiteSpace(type))
        {
            AddCriteria(a => a.Type.Value == type);
        }

        if (status.HasValue)
        {
            AddCriteria(a => a.Status == status.Value);
        }

        if (tagId.HasValue)
        {
            AddCriteria(a => a.Tags.Any(t => t.TagId == tagId.Value));
        }

        if (!string.IsNullOrWhiteSpace(term))
        {
            var lowered = term.Trim().ToLowerInvariant();
            AddCriteria(a =>
                a.FileName.Value.ToLower().Contains(lowered) ||
                (a.Title != null && a.Title.ToLower().Contains(lowered)) ||
                (a.AltText != null && a.AltText.Value != null && a.AltText.Value.ToLower().Contains(lowered)));
        }

        ApplyPaging(skip, take);
        ApplyOrderByDescending(a => a.CreatedAt);
    }
}

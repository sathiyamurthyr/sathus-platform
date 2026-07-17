using MediatR;
using Sathus.MediaRelations.Application.DTOs;
using Sathus.SharedKernel.Paging;

namespace Sathus.MediaRelations.Application.Queries.SearchReferences;

/// <summary>
/// Full search across the reference index. Every filter is optional and combined with AND.
/// Supports search by asset, content, reference type, module, relationship (usage type),
/// scope and status.
/// </summary>
public sealed record SearchReferencesQuery(
    Guid? AssetId = null,
    string? ReferenceType = null,
    string? Module = null,
    string? SourceReferenceId = null,
    string? UsageType = null,
    string? Scope = null,
    string? Status = null,
    int Page = 1,
    int PageSize = 50)
    : IRequest<PagedResult<MediaReferenceResponse>>;

using MediatR;
using Sathus.Media.Application.DTOs;
using Sathus.SharedKernel.Paging;

namespace Sathus.Media.Application.Queries.SearchMedia;

public sealed record SearchMediaQuery(
    string? Term = null,
    IReadOnlyList<string>? Types = null,
    IReadOnlyList<string>? Tags = null,
    Guid? FolderId = null,
    string? Status = null,
    string? Language = null,
    DateTime? From = null,
    DateTime? To = null,
    string SortBy = "relevance",
    bool Descending = true,
    int Page = 1,
    int PageSize = 25)
    : IRequest<PagedResult<MediaAssetSummaryResponse>>;

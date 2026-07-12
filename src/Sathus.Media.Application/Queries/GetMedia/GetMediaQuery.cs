using MediatR;
using Sathus.Media.Application.DTOs;
using Sathus.SharedKernel.Paging;

namespace Sathus.Media.Application.Queries.GetMedia;

public sealed record GetMediaQuery(
    Guid? FolderId = null,
    string? Type = null,
    string? Status = null,
    Guid? TagId = null,
    string? Term = null,
    int Page = 1,
    int PageSize = 25)
    : IRequest<PagedResult<MediaAssetSummaryResponse>>;

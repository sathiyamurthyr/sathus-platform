using MediatR;
using Sathus.Content.Application.DTOs;
using Sathus.Content.Domain.Enums;

namespace Sathus.Content.Application.Queries.GetContentItems;

public sealed record GetContentItemsQuery(
    int Page = 1,
    int PageSize = 20,
    ContentType? ContentType = null,
    ContentStatus? Status = null,
    Guid? CategoryId = null,
    Guid? TagId = null,
    string? Search = null,
    string? SortBy = "createdAt",
    bool SortDescending = true)
    : IRequest<PagedResult<ContentItemResponse>>;

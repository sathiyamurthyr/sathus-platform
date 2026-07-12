using MediatR;
using Sathus.Identity.Application.DTOs;
using Sathus.Identity.Domain.Enums;

namespace Sathus.Identity.Application.Queries.GetUsers;

public sealed record GetUsersQuery(
    int Page = 1,
    int PageSize = 20,
    string? Search = null,
    UserStatus? Status = null)
    : IRequest<PagedResult<UserSummary>>;

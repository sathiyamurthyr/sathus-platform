using MediatR;
using Sathus.Identity.Application.DTOs;

namespace Sathus.Identity.Application.Queries.LoginHistory;

public sealed record LoginHistoryQuery(Guid UserId, int Page = 1, int PageSize = 20)
    : IRequest<PagedResult<LoginHistoryResponse>>;

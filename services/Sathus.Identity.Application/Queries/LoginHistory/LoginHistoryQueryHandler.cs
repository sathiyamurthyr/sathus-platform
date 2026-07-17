using MediatR;
using Sathus.Identity.Application.DTOs;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Domain.Entities;

namespace Sathus.Identity.Application.Queries.LoginHistory;

public sealed class LoginHistoryQueryHandler
    : IRequestHandler<LoginHistoryQuery, PagedResult<LoginHistoryResponse>>
{
    private readonly ILoginHistoryRepository _loginHistory;

    public LoginHistoryQueryHandler(ILoginHistoryRepository loginHistory)
    {
        _loginHistory = loginHistory;
    }

    public async Task<PagedResult<LoginHistoryResponse>> Handle(
        LoginHistoryQuery request,
        CancellationToken cancellationToken)
    {
        var page = request.Page < 1 ? 1 : request.Page;
        var pageSize = request.PageSize is < 1 or > 100 ? 20 : request.PageSize;

        var result = await _loginHistory.GetByUserPagedAsync(request.UserId, page, pageSize, cancellationToken);

        var items = result.Items
            .Select(h => new LoginHistoryResponse(
                h.Id,
                h.Status,
                h.CreatedAt,
                h.IpAddress,
                h.UserAgent,
                h.FailureReason))
            .ToList();

        return new PagedResult<LoginHistoryResponse>(items, result.Page, result.PageSize, result.TotalCount);
    }
}

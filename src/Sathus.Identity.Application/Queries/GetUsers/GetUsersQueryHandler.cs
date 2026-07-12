using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Sathus.Identity.Application.DTOs;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Application.Queries.GetUsers;

namespace Sathus.Identity.Application.Queries.GetUsers;

public sealed class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, PagedResult<UserSummary>>
{
    private readonly IUserRepository _users;

    public GetUsersQueryHandler(IUserRepository users)
    {
        _users = users;
    }

    public async Task<PagedResult<UserSummary>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        var page = request.Page < 1 ? 1 : request.Page;
        var pageSize = request.PageSize < 1 ? 20 : request.PageSize;

        var result = await _users.GetPagedAsync(page, pageSize, request.Search, request.Status, cancellationToken);

        var summaries = new List<UserSummary>(result.Items.Count);
        foreach (var user in result.Items)
        {
            var roles = await _users.GetRoleNamesAsync(user.Id, cancellationToken);
            summaries.Add(new UserSummary(user.Id, user.Email, user.FirstName, user.LastName, user.Status, roles));
        }

        return new PagedResult<UserSummary>(summaries, result.Page, result.PageSize, result.TotalCount);
    }
}

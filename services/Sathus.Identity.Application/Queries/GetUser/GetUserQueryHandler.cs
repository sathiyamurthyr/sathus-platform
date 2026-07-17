using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Sathus.Identity.Application.DTOs;
using Sathus.Identity.Application.Exceptions;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Application.Queries.GetUser;

namespace Sathus.Identity.Application.Queries.GetUser;

public sealed class GetUserQueryHandler : IRequestHandler<GetUserQuery, UserDetailResponse>
{
    private readonly IUserRepository _users;

    public GetUserQueryHandler(IUserRepository users)
    {
        _users = users;
    }

    public async Task<UserDetailResponse> Handle(GetUserQuery request, CancellationToken cancellationToken)
    {
        var user = await _users.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null)
        {
            throw new UserNotFoundException($"User '{request.UserId}' was not found.");
        }

        var roles = await _users.GetRoleNamesAsync(user.Id, cancellationToken);
        var permissions = await _users.GetPermissionNamesAsync(user.Id, cancellationToken);

        return new UserDetailResponse(
            user.Id,
            user.Email,
            user.FirstName,
            user.LastName,
            user.Status,
            user.EmailConfirmed,
            user.MFAEnabled,
            user.CreatedAt,
            user.LastLoginAt,
            roles,
            permissions);
    }
}

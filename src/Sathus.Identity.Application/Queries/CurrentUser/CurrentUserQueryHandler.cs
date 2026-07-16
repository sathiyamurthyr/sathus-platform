using MediatR;
using Sathus.Identity.Application.DTOs;
using Sathus.Identity.Application.Exceptions;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Domain.Entities;

namespace Sathus.Identity.Application.Queries.CurrentUser;

public sealed class CurrentUserQueryHandler : IRequestHandler<CurrentUserQuery, CurrentUserResponse>
{
    private readonly IUserRepository _users;

    public CurrentUserQueryHandler(IUserRepository users)
    {
        _users = users;
    }

    public async Task<CurrentUserResponse> Handle(CurrentUserQuery request, CancellationToken cancellationToken)
    {
        var user = await _users.GetByIdAsync(request.UserId, cancellationToken);

        if (user is null)
        {
            throw new UserNotFoundException($"User '{request.UserId}' was not found.");
        }

        var roles = await _users.GetRoleNamesAsync(user.Id, cancellationToken);
        var permissions = await _users.GetPermissionNamesAsync(user.Id, cancellationToken);

        return new CurrentUserResponse(
            user.Id,
            user.Email,
            user.FirstName,
            user.LastName,
            user.Status,
            user.EmailConfirmed,
            user.MFAEnabled,
            roles,
            permissions);
    }
}

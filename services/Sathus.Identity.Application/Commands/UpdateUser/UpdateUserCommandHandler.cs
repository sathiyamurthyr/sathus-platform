using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Sathus.Identity.Application.DTOs;
using Sathus.Identity.Application.Exceptions;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Domain.Entities;
using Sathus.Identity.Domain.Enums;
using Sathus.Identity.Application.Commands.UpdateUser;

namespace Sathus.Identity.Application.Commands.UpdateUser;

public sealed class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, UserResponse>
{
    private readonly IUserRepository _users;
    private readonly IAuditService _audit;

    public UpdateUserCommandHandler(IUserRepository users, IAuditService audit)
    {
        _users = users;
        _audit = audit;
    }

    public async Task<UserResponse> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _users.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null)
        {
            throw new UserNotFoundException($"User '{request.UserId}' was not found.");
        }

        var now = DateTime.UtcNow;
        user.UpdateProfile(request.FirstName, request.LastName, now);

        if (request.Status.HasValue && request.Status.Value != user.Status)
        {
            switch (request.Status.Value)
            {
                case UserStatus.Active:
                    user.Reactivate(now);
                    break;
                case UserStatus.Suspended:
                    user.Suspend(now);
                    break;
                case UserStatus.Pending:
                    user.MarkAsPending(now);
                    break;
                case UserStatus.Deleted:
                    user.SoftDelete(now);
                    break;
            }
        }

        if (request.RoleIds is not null)
        {
            user.ReplaceRoles(request.RoleIds, now);
        }

        await _users.UpdateAsync(user, cancellationToken);

        await _audit.LogAsync(
            new AuditEntry("UpdateUser", nameof(User), user.Id, EntityId: user.Id.ToString()),
            cancellationToken);

        var roles = await _users.GetRoleNamesAsync(user.Id, cancellationToken);

        return new UserResponse(user.Id, user.Email, user.FirstName, user.LastName, user.Status, roles);
    }
}

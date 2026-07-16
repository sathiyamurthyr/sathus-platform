using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Sathus.Identity.Application.DTOs;
using Sathus.Identity.Application.Exceptions;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Domain.Entities;
using Sathus.Identity.Domain.Enums;
using Sathus.Identity.Application.Commands.CreateUser;

namespace Sathus.Identity.Application.Commands.CreateUser;

public sealed class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, UserResponse>
{
    private readonly IUserRepository _users;
    private readonly IPasswordService _passwords;
    private readonly IAuditService _audit;

    public CreateUserCommandHandler(IUserRepository users, IPasswordService passwords, IAuditService audit)
    {
        _users = users;
        _passwords = passwords;
        _audit = audit;
    }

    public async Task<UserResponse> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        if (await _users.ExistsByEmailAsync(request.Email, cancellationToken))
        {
            throw new EmailAlreadyExistsException($"A user with email '{request.Email}' already exists.");
        }

        var now = DateTime.UtcNow;
        var user = new User(
            request.Email,
            request.FirstName,
            request.LastName,
            _passwords.HashPassword(request.Password),
            AuthProvider.Local);

        user.ConfirmEmail(now);
        user.ReplaceRoles(request.RoleIds, now);

        await _users.AddAsync(user, cancellationToken);

        await _audit.LogAsync(
            new AuditEntry("CreateUser", nameof(User), user.Id, EntityId: user.Id.ToString()),
            cancellationToken);

        var roles = await _users.GetRoleNamesAsync(user.Id, cancellationToken);

        return new UserResponse(user.Id, user.Email, user.FirstName, user.LastName, user.Status, roles);
    }
}

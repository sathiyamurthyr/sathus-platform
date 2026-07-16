using MediatR;
using Sathus.Identity.Application.DTOs;
using Sathus.Identity.Application.Exceptions;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Domain.Entities;
using Sathus.Identity.Domain.Enums;

namespace Sathus.Identity.Application.Commands.RegisterUser;

public sealed class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, UserResponse>
{
    private readonly IUserRepository _users;
    private readonly IPasswordService _passwords;
    private readonly IEmailService _email;
    private readonly IJwtService _jwt;
    private readonly IAuditService _audit;

    public RegisterUserCommandHandler(
        IUserRepository users,
        IPasswordService passwords,
        IEmailService email,
        IJwtService jwt,
        IAuditService audit)
    {
        _users = users;
        _passwords = passwords;
        _email = email;
        _jwt = jwt;
        _audit = audit;
    }

    public async Task<UserResponse> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        if (await _users.ExistsByEmailAsync(request.Email, cancellationToken))
        {
            throw new EmailAlreadyExistsException($"A user with email '{request.Email}' already exists.");
        }

        var user = new User(
            request.Email,
            request.FirstName,
            request.LastName,
            _passwords.HashPassword(request.Password),
            AuthProvider.Local);

        user.MarkAsPending(DateTime.UtcNow);

        await _users.AddAsync(user, cancellationToken);

        var verificationToken = _jwt.GenerateEmailVerificationToken(user.Id, user.Email);
        await _email.SendVerificationEmailAsync(user.Email, verificationToken, cancellationToken);

        await _audit.LogAsync(
            new AuditEntry("RegisterUser", nameof(User), user.Id, EntityId: user.Id.ToString()),
            cancellationToken);

        var roles = await _users.GetRoleNamesAsync(user.Id, cancellationToken);

        return new UserResponse(user.Id, user.Email, user.FirstName, user.LastName, user.Status, roles);
    }
}

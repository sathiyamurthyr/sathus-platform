using MediatR;
using Sathus.Identity.Application.DTOs;
using Sathus.Identity.Application.Exceptions;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Domain.Entities;
using Sathus.Identity.Domain.Enums;

namespace Sathus.Identity.Application.Commands.Login;

public sealed class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResponse>
{
    private const int AccessTokenLifetimeSeconds = 900;
    private const int MaxFailedAttempts = 5;
    private const int LockoutWindowMinutes = 15;

    private readonly IUserRepository _users;
    private readonly IJwtService _jwt;
    private readonly IPasswordService _passwords;
    private readonly IRefreshTokenService _refreshTokens;
    private readonly ISessionService _sessions;
    private readonly ILoginHistoryRepository _loginHistory;
    private readonly IAuditService _audit;

    public LoginCommandHandler(
        IUserRepository users,
        IJwtService jwt,
        IPasswordService passwords,
        IRefreshTokenService refreshTokens,
        ISessionService sessions,
        ILoginHistoryRepository loginHistory,
        IAuditService audit)
    {
        _users = users;
        _jwt = jwt;
        _passwords = passwords;
        _refreshTokens = refreshTokens;
        _sessions = sessions;
        _loginHistory = loginHistory;
        _audit = audit;
    }

    public async Task<LoginResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await _users.GetByEmailAsync(request.Email, cancellationToken);

        if (user is null)
        {
            throw new AuthenticationException("Invalid email or password.");
        }

        var windowStart = DateTime.UtcNow.AddMinutes(-LockoutWindowMinutes);
        var recentFailures = await _loginHistory.CountRecentFailuresAsync(user.Id, windowStart, cancellationToken);

        if (recentFailures >= MaxFailedAttempts)
        {
            await _loginHistory.AddAsync(
                new LoginHistory(user.Id, null, null, LoginStatus.LockedOut, "Too many failed attempts."),
                cancellationToken);

            throw new AccountLockedException(
                "Account is temporarily locked due to multiple failed login attempts.",
                DateTimeOffset.UtcNow.AddMinutes(LockoutWindowMinutes));
        }

        if (!_passwords.VerifyPassword(request.Password, user.PasswordHash))
        {
            await _loginHistory.AddAsync(
                new LoginHistory(user.Id, null, null, LoginStatus.Failed, "Invalid password."),
                cancellationToken);

            throw new AuthenticationException("Invalid email or password.");
        }

        if (user.Status != UserStatus.Active)
        {
            var reason = user.Status switch
            {
                UserStatus.Pending => "Email address has not been confirmed.",
                UserStatus.Suspended => "Account has been suspended.",
                UserStatus.Deleted => "Account has been deleted.",
                _ => "Account is not active."
            };

            await _loginHistory.AddAsync(
                new LoginHistory(user.Id, null, null, LoginStatus.Failed, $"Inactive account ({user.Status})."),
                cancellationToken);

            throw new AuthenticationException(reason);
        }

        user.RecordLogin(DateTime.UtcNow);
        await _users.UpdateAsync(user, cancellationToken);

        var roles = await _users.GetRoleNamesAsync(user.Id, cancellationToken);
        var permissions = await _users.GetPermissionNamesAsync(user.Id, cancellationToken);

        var accessToken = _jwt.GenerateAccessToken(user.Id, user.Email, roles, permissions);
        var refreshToken = await _refreshTokens.GenerateTokenAsync(user.Id, cancellationToken);
        await _sessions.CreateSessionAsync(user.Id, null, null, cancellationToken);

        await _loginHistory.AddAsync(
            new LoginHistory(user.Id, null, null, LoginStatus.Success, null),
            cancellationToken);

        await _audit.LogAsync(
            new AuditEntry("Login", nameof(User), user.Id, IpAddress: null),
            cancellationToken);

        var summary = new UserSummary(user.Id, user.Email, user.FirstName, user.LastName, user.Status, roles);

        return new LoginResponse(accessToken, refreshToken.Token, AccessTokenLifetimeSeconds, summary);
    }
}

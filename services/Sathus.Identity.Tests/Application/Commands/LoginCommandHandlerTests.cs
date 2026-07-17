using FluentAssertions;
using MediatR;
using Moq;
using Sathus.Identity.Application.Commands.Login;
using Sathus.Identity.Application.DTOs;
using Sathus.Identity.Application.Exceptions;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Domain.Entities;
using Sathus.Identity.Domain.Enums;
using Sathus.Identity.Infrastructure.Services;
using Xunit;

namespace Sathus.Identity.Tests.Application.Commands;

public class LoginCommandHandlerTests
{
    private static User ActiveUser() =>
        new User("user@example.com", "Ada", "Lovelace", "hashed", AuthProvider.Local);

    [Fact]
    public async Task Handle_ActiveUserWithValidPassword_ReturnsLoginResponse()
    {
        var user = ActiveUser();
        var repo = new Mock<IUserRepository>();
        repo.Setup(r => r.GetByEmailAsync(It.IsAny<string>(), It.IsAny<CancellationToken>())).ReturnsAsync(user);
        repo.Setup(r => r.GetRoleNamesAsync(user.Id, It.IsAny<CancellationToken>())).ReturnsAsync(new[] { "PlatformAdmin" });
        repo.Setup(r => r.GetPermissionNamesAsync(user.Id, It.IsAny<CancellationToken>())).ReturnsAsync(new[] { "users.read" });

        var passwords = new Mock<IPasswordService>();
        passwords.Setup(p => p.VerifyPassword(It.IsAny<string>(), It.IsAny<string>())).Returns(true);

        var jwt = new Mock<IJwtService>();
        jwt.Setup(j => j.GenerateAccessToken(It.IsAny<Guid>(), It.IsAny<string>(), It.IsAny<IReadOnlyList<string>>(), It.IsAny<IReadOnlyList<string>>())).Returns("access-token");

        var refreshTokens = new Mock<IRefreshTokenService>();
        refreshTokens.Setup(r => r.GenerateTokenAsync(user.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new RefreshToken("refresh-token", user.Id, DateTime.UtcNow.AddDays(30)));

        var sessions = new Mock<ISessionService>();
        var loginHistory = new Mock<ILoginHistoryRepository>();
        loginHistory.Setup(l => l.CountRecentFailuresAsync(user.Id, It.IsAny<DateTime>(), It.IsAny<CancellationToken>())).ReturnsAsync(0);
        var audit = new Mock<IAuditService>();

        var handler = new LoginCommandHandler(
            repo.Object, jwt.Object, passwords.Object, refreshTokens.Object,
            sessions.Object, loginHistory.Object, audit.Object);

        var result = await handler.Handle(new LoginCommand("user@example.com", "Sup3r!Secret", true), CancellationToken.None);

        result.AccessToken.Should().Be("access-token");
        result.RefreshToken.Should().Be("refresh-token");
        result.ExpiresIn.Should().Be(900);
        result.User.Email.Should().Be("user@example.com");
        repo.Verify(r => r.UpdateAsync(user, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_UnknownUser_ThrowsAuthenticationException()
    {
        var repo = new Mock<IUserRepository>();
        repo.Setup(r => r.GetByEmailAsync(It.IsAny<string>(), It.IsAny<CancellationToken>())).ReturnsAsync((User?)null);

        var handler = new LoginCommandHandler(
            repo.Object, Mock.Of<IJwtService>(), Mock.Of<IPasswordService>(),
            Mock.Of<IRefreshTokenService>(), Mock.Of<ISessionService>(),
            Mock.Of<ILoginHistoryRepository>(), Mock.Of<IAuditService>());

        var act = async () => await handler.Handle(new LoginCommand("missing@example.com", "Sup3r!Secret", true), CancellationToken.None);

        await act.Should().ThrowAsync<AuthenticationException>();
    }

    [Fact]
    public async Task Handle_WrongPassword_ThrowsAuthenticationException()
    {
        var user = ActiveUser();
        var repo = new Mock<IUserRepository>();
        repo.Setup(r => r.GetByEmailAsync(It.IsAny<string>(), It.IsAny<CancellationToken>())).ReturnsAsync(user);

        var passwords = new Mock<IPasswordService>();
        passwords.Setup(p => p.VerifyPassword(It.IsAny<string>(), It.IsAny<string>())).Returns(false);

        var loginHistory = new Mock<ILoginHistoryRepository>();
        loginHistory.Setup(l => l.CountRecentFailuresAsync(user.Id, It.IsAny<DateTime>(), It.IsAny<CancellationToken>())).ReturnsAsync(0);

        var handler = new LoginCommandHandler(
            repo.Object, Mock.Of<IJwtService>(), passwords.Object,
            Mock.Of<IRefreshTokenService>(), Mock.Of<ISessionService>(),
            loginHistory.Object, Mock.Of<IAuditService>());

        var act = async () => await handler.Handle(new LoginCommand("user@example.com", "wrong", true), CancellationToken.None);

        await act.Should().ThrowAsync<AuthenticationException>();
    }

    [Fact]
    public async Task Handle_PendingUser_ThrowsAuthenticationException()
    {
        var user = ActiveUser();
        user.MarkAsPending(DateTime.UtcNow);
        var repo = new Mock<IUserRepository>();
        repo.Setup(r => r.GetByEmailAsync(It.IsAny<string>(), It.IsAny<CancellationToken>())).ReturnsAsync(user);

        var passwords = new Mock<IPasswordService>();
        passwords.Setup(p => p.VerifyPassword(It.IsAny<string>(), It.IsAny<string>())).Returns(true);

        var loginHistory = new Mock<ILoginHistoryRepository>();
        loginHistory.Setup(l => l.CountRecentFailuresAsync(user.Id, It.IsAny<DateTime>(), It.IsAny<CancellationToken>())).ReturnsAsync(0);

        var handler = new LoginCommandHandler(
            repo.Object, Mock.Of<IJwtService>(), passwords.Object,
            Mock.Of<IRefreshTokenService>(), Mock.Of<ISessionService>(),
            loginHistory.Object, Mock.Of<IAuditService>());

        var act = async () => await handler.Handle(new LoginCommand("user@example.com", "Sup3r!Secret", true), CancellationToken.None);

        await act.Should().ThrowAsync<AuthenticationException>()
            .WithMessage("*not been confirmed*");
    }
}

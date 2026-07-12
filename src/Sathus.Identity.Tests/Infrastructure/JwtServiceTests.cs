using FluentAssertions;
using Microsoft.Extensions.Options;
using Sathus.Identity.Infrastructure.Security;
using Sathus.Identity.Infrastructure.Services;
using Xunit;

namespace Sathus.Identity.Tests.Infrastructure;

public class JwtServiceTests
{
    private const string Secret = "sathus-platform-development-secret-key-change-me-0000000000";

    private static JwtService CreateService() =>
        new JwtService(Options.Create(new JwtOptions
        {
            Secret = Secret,
            Issuer = "sathus-platform",
            Audience = "sathus-platform",
            AccessTokenExpiryMinutes = 15,
            RefreshTokenExpiryDays = 30,
        }));

    [Fact]
    public void GenerateAccessToken_ReturnsParseableTokenWithSubject()
    {
        var service = CreateService();
        var userId = Guid.NewGuid();

        var token = service.GenerateAccessToken(userId, "user@example.com", new[] { "PlatformAdmin" }, new[] { "users.read" });

        token.Should().NotBeNullOrWhiteSpace();
        service.ValidateToken(token).Should().BeTrue();
        service.GetUserIdFromToken(token).Should().Be(userId);
    }

    [Fact]
    public void ValidateToken_ReturnsFalseForTamperedToken()
    {
        var service = CreateService();

        service.ValidateToken("not-a-real-token").Should().BeFalse();
    }

    [Fact]
    public void GenerateRefreshToken_ReturnsUniqueOpaqueValue()
    {
        var service = CreateService();

        var a = service.GenerateRefreshToken();
        var b = service.GenerateRefreshToken();

        a.Should().NotBeNullOrWhiteSpace();
        b.Should().NotBe(a);
    }

    [Fact]
    public void EmailVerificationToken_RoundTripsUserId()
    {
        var service = CreateService();
        var userId = Guid.NewGuid();

        var token = service.GenerateEmailVerificationToken(userId, "user@example.com");

        service.TryValidateEmailVerificationToken(token, out var parsed).Should().BeTrue();
        parsed.Should().Be(userId);
    }

    [Fact]
    public void PasswordResetToken_RoundTripsUserId()
    {
        var service = CreateService();
        var userId = Guid.NewGuid();

        var token = service.GeneratePasswordResetToken(userId, "user@example.com");

        service.TryValidatePasswordResetToken(token, out var parsed).Should().BeTrue();
        parsed.Should().Be(userId);
    }
}

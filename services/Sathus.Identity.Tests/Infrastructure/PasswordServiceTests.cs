using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Moq;
using Sathus.Identity.Infrastructure.Persistence;
using Sathus.Identity.Infrastructure.Services;
using Xunit;

namespace Sathus.Identity.Tests.Infrastructure;

public class PasswordServiceTests
{
    private static PasswordService CreateService()
    {
        var options = new DbContextOptionsBuilder<IdentityDbContext>().Options;
        var context = new Mock<IdentityDbContext>(options).Object;
        return new PasswordService(context);
    }

    [Fact]
    public void HashPassword_ProducesBcryptHash()
    {
        var service = CreateService();

        var hash = service.HashPassword("Sup3r!Secret");

        hash.Should().StartWith("$2");
        hash.Should().NotBe("Sup3r!Secret");
    }

    [Fact]
    public void HashPassword_IsDeterministicPerCallButUniquePerPassword()
    {
        var service = CreateService();

        var first = service.HashPassword("Sup3r!Secret");
        var second = service.HashPassword("Sup3r!Secret");

        first.Should().NotBe(second);
        service.VerifyPassword("Sup3r!Secret", first).Should().BeTrue();
        service.VerifyPassword("Sup3r!Secret", second).Should().BeTrue();
    }

    [Fact]
    public void VerifyPassword_ReturnsFalseForWrongPassword()
    {
        var service = CreateService();
        var hash = service.HashPassword("Sup3r!Secret");

        service.VerifyPassword("wrong-password", hash).Should().BeFalse();
    }
}

using FluentAssertions;
using Sathus.Identity.Domain.Entities;
using Sathus.Identity.Domain.Enums;
using Xunit;

namespace Sathus.Identity.Tests.Domain;

public class UserTests
{
    private static User CreateUser() =>
        new User("user@example.com", "Ada", "Lovelace", "hashed", AuthProvider.Local);

    [Fact]
    public void Constructor_SetsIdentityAndDefaults()
    {
        var user = CreateUser();

        user.Id.Should().NotBe(Guid.Empty);
        user.Email.Should().Be("user@example.com");
        user.FirstName.Should().Be("Ada");
        user.LastName.Should().Be("Lovelace");
        user.PasswordHash.Should().Be("hashed");
        user.AuthProvider.Should().Be(AuthProvider.Local);
        user.Status.Should().Be(UserStatus.Active);
        user.EmailConfirmed.Should().BeFalse();
        user.MFAEnabled.Should().BeFalse();
        user.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
        user.UpdatedAt.Should().BeCloseTo(user.CreatedAt, TimeSpan.FromMilliseconds(10));
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Constructor_RejectsEmptyEmail(string email)
    {
        var act = () => new User(email, "Ada", "Lovelace", "hashed", AuthProvider.Local);
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Constructor_RejectsOverlongNames()
    {
        var act = () => new User("a@b.com", new string('x', 129), "Lovelace", "hashed", AuthProvider.Local);
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void ChangePassword_UpdatesHashAndTimestamp()
    {
        var user = CreateUser();
        var before = user.UpdatedAt;

        user.ChangePassword("new-hash", DateTime.UtcNow.AddMinutes(1));

        user.PasswordHash.Should().Be("new-hash");
        user.UpdatedAt.Should().BeAfter(before);
    }

    [Fact]
    public void EnableMfa_AndDisableMfa_ToggleState()
    {
        var user = CreateUser();

        user.EnableMFA("BASE32SECRET");
        user.MFAEnabled.Should().BeTrue();
        user.MFASecret.Should().Be("BASE32SECRET");

        user.DisableMFA();
        user.MFAEnabled.Should().BeFalse();
        user.MFASecret.Should().BeNull();
    }

    [Fact]
    public void EnableMfa_RejectsEmptySecret()
    {
        var user = CreateUser();
        var act = () => user.EnableMFA("");
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void RecordLogin_SetsLastLoginAt()
    {
        var user = CreateUser();
        var loginAt = DateTime.UtcNow;

        user.RecordLogin(loginAt);

        user.LastLoginAt.Should().Be(loginAt);
        user.UpdatedAt.Should().Be(loginAt);
    }

    [Theory]
    [InlineData(UserStatus.Pending)]
    [InlineData(UserStatus.Suspended)]
    [InlineData(UserStatus.Deleted)]
    public void StatusTransitions_UpdateState(UserStatus target)
    {
        var user = CreateUser();

        switch (target)
        {
            case UserStatus.Pending:
                user.MarkAsPending(DateTime.UtcNow);
                break;
            case UserStatus.Suspended:
                user.Suspend(DateTime.UtcNow);
                break;
            case UserStatus.Deleted:
                user.SoftDelete(DateTime.UtcNow);
                break;
        }

        user.Status.Should().Be(target);
    }

    [Fact]
    public void Reactivate_ReturnsToActive()
    {
        var user = CreateUser();
        user.Suspend(DateTime.UtcNow);

        user.Reactivate(DateTime.UtcNow);

        user.Status.Should().Be(UserStatus.Active);
    }
}

using FluentAssertions;
using Sathus.Identity.Application.Commands.RegisterUser;
using Sathus.Identity.Application.Validators;
using Xunit;

namespace Sathus.Identity.Tests.Application.Validators;

public class RegisterUserCommandValidatorTests
{
    private readonly RegisterUserCommandValidator _validator = new();

    private static RegisterUserCommand Valid() =>
        new("user@example.com", "Sup3r!Secret", "Ada", "Lovelace");

    [Fact]
    public void ValidCommand_Passes()
    {
        var result = _validator.Validate(Valid());
        result.IsValid.Should().BeTrue();
    }

    [Theory]
    [InlineData("")]
    [InlineData("bad-email")]
    public void InvalidEmail_Fails(string email)
    {
        var result = _validator.Validate(Valid() with { Email = email });
        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public void PasswordWithoutUppercase_Fails()
    {
        var result = _validator.Validate(Valid() with { Password = "sup3r!secret" });
        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public void PasswordWithoutSpecialCharacter_Fails()
    {
        var result = _validator.Validate(Valid() with { Password = "Sup3rsecret1" });
        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public void PasswordWithoutNumber_Fails()
    {
        var result = _validator.Validate(Valid() with { Password = "Supr!SecretX" });
        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public void MissingNames_Fails()
    {
        var result = _validator.Validate(Valid() with { FirstName = "", LastName = "" });
        result.IsValid.Should().BeFalse();
    }
}

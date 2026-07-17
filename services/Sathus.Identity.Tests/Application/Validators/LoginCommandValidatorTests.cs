using FluentAssertions;
using FluentValidation;
using Sathus.Identity.Application.Commands.Login;
using Sathus.Identity.Application.Validators;
using Xunit;

namespace Sathus.Identity.Tests.Application.Validators;

public class LoginCommandValidatorTests
{
    private readonly LoginCommandValidator _validator = new();

    private static LoginCommand Valid() => new("user@example.com", "Sup3r!Secret", true);

    [Fact]
    public void ValidCommand_Passes()
    {
        var result = _validator.Validate(Valid());
        result.IsValid.Should().BeTrue();
    }

    [Theory]
    [InlineData("")]
    [InlineData("not-an-email")]
    public void InvalidEmail_Fails(string email)
    {
        var result = _validator.Validate(Valid() with { Email = email });
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(LoginCommand.Email));
    }

    [Fact]
    public void ShortPassword_Fails()
    {
        var result = _validator.Validate(Valid() with { Password = "short" });
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(LoginCommand.Password));
    }

    [Fact]
    public void MissingPassword_Fails()
    {
        var result = _validator.Validate(Valid() with { Password = "" });
        result.IsValid.Should().BeFalse();
    }
}

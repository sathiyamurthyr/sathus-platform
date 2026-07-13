using FluentAssertions;
using Sathus.Navigation.Application.Commands.CreateMenu;
using Sathus.Navigation.Application.Validators;

namespace Sathus.Navigation.Tests.Application.Validators;

public class CreateMenuCommandValidatorTests
{
    private readonly CreateMenuCommandValidator _validator = new();

    [Fact]
    public void Valid_Command_Should_Pass()
    {
        var result = _validator.Validate(new CreateMenuCommand(Guid.NewGuid(), "Main", "main"));
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void Invalid_Menu_Type_Should_Fail()
    {
        var result = _validator.Validate(new CreateMenuCommand(Guid.NewGuid(), "Main", "INVALID TYPE!"));
        result.IsValid.Should().BeFalse();
    }
}

using FluentAssertions;
using Sathus.Navigation.Application.Commands.CreateTree;
using Sathus.Navigation.Application.Validators;

namespace Sathus.Navigation.Tests.Application.Validators;

public class CreateTreeCommandValidatorTests
{
    private readonly CreateTreeCommandValidator _validator = new();

    [Fact]
    public void Valid_Command_Should_Pass()
    {
        var result = _validator.Validate(new CreateTreeCommand("Website", "Main", "en"));
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void Empty_Name_Should_Fail()
    {
        var result = _validator.Validate(new CreateTreeCommand("Website", "", "en"));
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(CreateTreeCommand.Name));
    }

    [Fact]
    public void Invalid_Locale_Should_Fail()
    {
        var result = _validator.Validate(new CreateTreeCommand("Website", "Main", "e"));
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(CreateTreeCommand.DefaultLocale));
    }

    [Fact]
    public void Empty_Platform_Should_Fail()
    {
        var result = _validator.Validate(new CreateTreeCommand("", "Main", "en"));
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(CreateTreeCommand.Platform));
    }
}

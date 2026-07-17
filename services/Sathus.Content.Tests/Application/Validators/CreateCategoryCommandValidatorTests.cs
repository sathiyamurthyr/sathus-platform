using FluentAssertions;
using Sathus.Content.Application.Commands.CreateCategory;
using Sathus.Content.Application.Validators;
using Xunit;

namespace Sathus.Content.Tests.Application.Validators;

public class CreateCategoryCommandValidatorTests
{
    private readonly CreateCategoryCommandValidator _validator = new();

    [Fact]
    public void Validate_ValidCommand_Passes()
    {
        var result = _validator.Validate(new CreateCategoryCommand("Technology", "technology"));

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void Validate_MissingName_Fails()
    {
        var result = _validator.Validate(new CreateCategoryCommand("", "tech"));

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(CreateCategoryCommand.Name));
    }

    [Fact]
    public void Validate_NameTooLong_Fails()
    {
        var result = _validator.Validate(new CreateCategoryCommand(new string('a', 129), "tech"));

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(CreateCategoryCommand.Name));
    }
}

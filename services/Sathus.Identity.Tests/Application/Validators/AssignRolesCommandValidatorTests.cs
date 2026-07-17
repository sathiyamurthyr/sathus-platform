using FluentAssertions;
using Sathus.Identity.Application.Commands.AssignRoles;
using Sathus.Identity.Application.Validators;
using Xunit;

namespace Sathus.Identity.Tests.Application.Validators;

public class AssignRolesCommandValidatorTests
{
    private readonly AssignRolesCommandValidator _validator = new();

    [Fact]
    public void Validate_ValidCommand_Passes()
    {
        var result = _validator.Validate(new AssignRolesCommand(Guid.NewGuid(), new[] { Guid.NewGuid() }));

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void Validate_MissingUserId_Fails()
    {
        var result = _validator.Validate(new AssignRolesCommand(Guid.Empty, new[] { Guid.NewGuid() }));

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(AssignRolesCommand.UserId));
    }

    [Fact]
    public void Validate_NullRoleIds_Fails()
    {
        var result = _validator.Validate(new AssignRolesCommand(Guid.NewGuid(), null!));

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(AssignRolesCommand.RoleIds));
    }
}

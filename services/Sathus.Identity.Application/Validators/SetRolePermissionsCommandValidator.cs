using FluentValidation;
using Sathus.Identity.Application.Commands.SetRolePermissions;

namespace Sathus.Identity.Application.Validators;

public sealed class SetRolePermissionsCommandValidator : AbstractValidator<SetRolePermissionsCommand>
{
    public SetRolePermissionsCommandValidator()
    {
        RuleFor(x => x.RoleId)
            .NotEmpty().WithMessage("RoleId is required.");

        RuleFor(x => x.PermissionIds)
            .NotNull().WithMessage("PermissionIds is required.");
    }
}

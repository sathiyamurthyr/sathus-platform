using FluentValidation;
using Sathus.Identity.Application.Commands.AssignRoles;

namespace Sathus.Identity.Application.Validators;

public sealed class AssignRolesCommandValidator : AbstractValidator<AssignRolesCommand>
{
    public AssignRolesCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("UserId is required.");

        RuleFor(x => x.RoleIds)
            .NotNull().WithMessage("RoleIds is required.");
    }
}

using FluentValidation;
using Sathus.Identity.Application.Commands.DisableMfa;

namespace Sathus.Identity.Application.Validators;

public sealed class DisableMfaCommandValidator : AbstractValidator<DisableMfaCommand>
{
    public DisableMfaCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User id is required.");
    }
}

using FluentValidation;
using Sathus.Identity.Application.Commands.EnableMfa;

namespace Sathus.Identity.Application.Validators;

public sealed class EnableMfaCommandValidator : AbstractValidator<EnableMfaCommand>
{
    public EnableMfaCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User id is required.");
    }
}

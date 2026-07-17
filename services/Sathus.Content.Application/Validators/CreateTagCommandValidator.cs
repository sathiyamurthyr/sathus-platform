using FluentValidation;
using Sathus.Content.Application.Commands.CreateTag;

namespace Sathus.Content.Application.Validators;

public sealed class CreateTagCommandValidator : AbstractValidator<CreateTagCommand>
{
    public CreateTagCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MaximumLength(128).WithMessage("Name must not exceed 128 characters.");

        RuleFor(x => x.Slug)
            .NotEmpty().WithMessage("Slug is required.")
            .MaximumLength(128).WithMessage("Slug must not exceed 128 characters.");
    }
}

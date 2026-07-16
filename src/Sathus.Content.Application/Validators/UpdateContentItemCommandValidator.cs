using FluentValidation;
using Sathus.Content.Application.Commands.UpdateContentItem;

namespace Sathus.Content.Application.Validators;

public sealed class UpdateContentItemCommandValidator : AbstractValidator<UpdateContentItemCommand>
{
    public UpdateContentItemCommandValidator()
    {
        RuleFor(x => x.ContentItemId)
            .NotEmpty().WithMessage("ContentItemId is required.");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(256).WithMessage("Title must not exceed 256 characters.");

        RuleFor(x => x.Slug)
            .NotEmpty().WithMessage("Slug is required.")
            .MaximumLength(256).WithMessage("Slug must not exceed 256 characters.");

        RuleFor(x => x.Body)
            .NotEmpty().WithMessage("Body is required.")
            .MaximumLength(100000).WithMessage("Body must not exceed 100,000 characters.");

        RuleFor(x => x.ContentType)
            .IsInEnum().WithMessage("ContentType is required.");
    }
}

using FluentValidation;
using Sathus.Media.Application.Commands.DeleteMedia;

namespace Sathus.Media.Application.Validators;

public sealed class DeleteMediaCommandValidator : AbstractValidator<DeleteMediaCommand>
{
    public DeleteMediaCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty().WithMessage("Asset id is required.");
    }
}

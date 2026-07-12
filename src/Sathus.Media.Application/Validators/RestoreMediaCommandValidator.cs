using FluentValidation;
using Sathus.Media.Application.Commands.RestoreMedia;

namespace Sathus.Media.Application.Validators;

public sealed class RestoreMediaCommandValidator : AbstractValidator<RestoreMediaCommand>
{
    public RestoreMediaCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty().WithMessage("Asset id is required.");
    }
}

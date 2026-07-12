using FluentValidation;
using Sathus.Media.Application.Commands.ArchiveMedia;

namespace Sathus.Media.Application.Validators;

public sealed class ArchiveMediaCommandValidator : AbstractValidator<ArchiveMediaCommand>
{
    public ArchiveMediaCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty().WithMessage("Asset id is required.");
    }
}

using FluentValidation;
using Sathus.Content.Application.Commands.CreateMediaAsset;

namespace Sathus.Content.Application.Validators;

public sealed class CreateMediaAssetCommandValidator : AbstractValidator<CreateMediaAssetCommand>
{
    public CreateMediaAssetCommandValidator()
    {
        RuleFor(x => x.Filename)
            .NotEmpty().WithMessage("Filename is required.");

        RuleFor(x => x.OriginalName)
            .NotEmpty().WithMessage("OriginalName is required.");

        RuleFor(x => x.MimeType)
            .NotEmpty().WithMessage("MimeType is required.");

        RuleFor(x => x.Size)
            .GreaterThan(0).WithMessage("Size must be greater than 0.");

        RuleFor(x => x.Url)
            .NotEmpty().WithMessage("Url is required.");
    }
}

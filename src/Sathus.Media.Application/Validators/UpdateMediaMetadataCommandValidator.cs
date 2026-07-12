using FluentValidation;
using Sathus.Media.Application.Commands.UpdateMediaMetadata;
using Sathus.Media.Domain.ValueObjects;

namespace Sathus.Media.Application.Validators;

public sealed class UpdateMediaMetadataCommandValidator : AbstractValidator<UpdateMediaMetadataCommand>
{
    public UpdateMediaMetadataCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty().WithMessage("Asset id is required.");

        RuleFor(x => x.Language)
            .Must(lang => string.IsNullOrWhiteSpace(lang) || BeValidLanguage(lang!))
            .WithMessage("Language code must be a valid ISO 639-1 code.")
            .When(x => x.Language is not null);

        RuleFor(x => x.AltText)
            .MaximumLength(AltText.MaxLength)
            .WithMessage($"Alt text must be at most {AltText.MaxLength} characters.")
            .When(x => x.AltText is not null);
    }

    private static bool BeValidLanguage(string value)
    {
        try
        {
            LanguageCode.Create(value);
            return true;
        }
        catch
        {
            return false;
        }
    }
}

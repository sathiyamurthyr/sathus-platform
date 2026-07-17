using FluentValidation;
using Sathus.Media.Application.Queries.SearchMedia;
using Sathus.Media.Domain.ValueObjects;

namespace Sathus.Media.Application.Validators;

public sealed class SearchMediaQueryValidator : AbstractValidator<SearchMediaQuery>
{
    public SearchMediaQueryValidator()
    {
        RuleFor(x => x.Page).GreaterThanOrEqualTo(1).WithMessage("Page must be at least 1.");
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100).WithMessage("Page size must be between 1 and 100.");

        RuleForEach(x => x.Types)
            .Must(BeValidMediaType)
            .WithMessage("One of the types is not a supported media type.")
            .When(x => x.Types is not null);

        RuleFor(x => x.Status)
            .Must(status => string.IsNullOrWhiteSpace(status) || BeValidStatus(status!))
            .WithMessage("Status is not a valid media status.")
            .When(x => x.Status is not null);

        RuleFor(x => x.Language)
            .Must(lang => string.IsNullOrWhiteSpace(lang) || BeValidLanguage(lang!))
            .WithMessage("Language code must be a valid ISO 639-1 code.")
            .When(x => x.Language is not null);
    }

    private static bool BeValidMediaType(string value)
    {
        try { MediaType.Create(value); return true; } catch { return false; }
    }

    private static bool BeValidStatus(string value) =>
        Enum.TryParse<MediaStatus>(value, ignoreCase: true, out _);

    private static bool BeValidLanguage(string value)
    {
        try { LanguageCode.Create(value); return true; } catch { return false; }
    }
}

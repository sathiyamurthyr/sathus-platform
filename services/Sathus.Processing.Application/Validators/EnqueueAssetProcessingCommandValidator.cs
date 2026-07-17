using FluentValidation;

namespace Sathus.Processing.Application.Validators;

public sealed class EnqueueAssetProcessingCommandValidator : AbstractValidator<EnqueueAssetProcessingCommand>
{
    public EnqueueAssetProcessingCommandValidator()
    {
        RuleFor(x => x.AssetId).NotEmpty();
        RuleFor(x => x.StorageKey).NotEmpty().MaximumLength(2048);
        RuleFor(x => x.FileName).NotEmpty().MaximumLength(512);
        RuleFor(x => x.MimeType)
            .NotEmpty()
            .Matches(@"^[a-z0-9][a-z0-9!#$&\-\^_]*\/[a-z0-9][a-z0-9!#$&\-\^_.]*$")
            .WithMessage("MIME type must be in the form type/subtype.");
        RuleFor(x => x.MediaType).NotEmpty().MaximumLength(64);
        RuleFor(x => x.FileSize).GreaterThan(0);
        RuleFor(x => x.MaxRetries).InclusiveBetween(0, 20);
    }
}

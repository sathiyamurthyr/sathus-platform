using FluentValidation;
using Sathus.Media.Application.Commands.CreateMediaAsset;
using Sathus.Media.Domain.ValueObjects;

namespace Sathus.Media.Application.Validators;

public sealed class CreateMediaAssetCommandValidator : AbstractValidator<CreateMediaAssetCommand>
{
    public CreateMediaAssetCommandValidator()
    {
        RuleFor(x => x.FileName)
            .NotEmpty().WithMessage("File name is required.")
            .Must(BeValidFileName).WithMessage("File name is invalid or too long.");

        RuleFor(x => x.FileExtension)
            .NotEmpty().WithMessage("File extension is required.")
            .Must(BeValidExtension).WithMessage("File extension is invalid.");

        RuleFor(x => x.MimeType)
            .NotEmpty().WithMessage("MIME type is required.")
            .Must(BeValidMimeType).WithMessage("MIME type must be in the form 'type/subtype'.");

        RuleFor(x => x.Size)
            .GreaterThan(0).WithMessage("Size must be greater than zero.")
            .LessThanOrEqualTo(FileSize.MaxBytes).WithMessage($"Size must not exceed {FileSize.MaxBytes} bytes.");

        RuleFor(x => x.Checksum)
            .NotEmpty().WithMessage("Checksum is required.")
            .Must(BeValidChecksum).WithMessage("Checksum must be in the form 'algorithm:hex' (e.g. 'sha256:...').");

        RuleFor(x => x.StorageKey)
            .NotEmpty().WithMessage("Storage key is required.")
            .Must(BeValidStorageKey).WithMessage("Storage key is invalid.");

        RuleFor(x => x.Type)
            .NotEmpty().WithMessage("Media type is required.")
            .Must(BeValidMediaType).WithMessage("Media type is not supported.");

        RuleFor(x => x.Language)
            .NotEmpty().WithMessage("Language code is required.")
            .Must(BeValidLanguage).WithMessage("Language code must be a valid ISO 639-1 code.");

        RuleFor(x => x.AltText)
            .MaximumLength(AltText.MaxLength).WithMessage($"Alt text must be at most {AltText.MaxLength} characters.");

        RuleFor(x => x.Width)
            .GreaterThan(0).When(x => x.Width.HasValue).WithMessage("Width must be greater than zero.");

        RuleFor(x => x.Height)
            .GreaterThan(0).When(x => x.Height.HasValue).WithMessage("Height must be greater than zero.");

        RuleFor(x => x.DurationSeconds)
            .GreaterThan(0).When(x => x.DurationSeconds.HasValue).WithMessage("Duration must be greater than zero.");

        RuleFor(x => x.InitialStatus)
            .Must(BeValidStatus).WithMessage("Initial status must be Draft, Processing or Ready.");

        RuleFor(x => x)
            .Must(HaveRequiredDimensionsForImage)
            .WithMessage("Image assets require width and height.")
            .When(x => x.Type == MediaType.Image.Value);

        RuleFor(x => x)
            .Must(HaveRequiredDurationForAv)
            .WithMessage("Audio and video assets require a duration.")
            .When(x => x.Type == MediaType.Video.Value || x.Type == MediaType.Audio.Value);
    }

    private static bool BeValidFileName(string? value) => Safe(() => FileName.Create(value!)) != null;
    private static bool BeValidExtension(string? value) => Safe(() => FileExtension.Create(value!)) != null;
    private static bool BeValidMimeType(string? value) => Safe(() => MimeType.Create(value!)) != null;
    private static bool BeValidChecksum(string? value) => Safe(() => Checksum.Create(value!)) != null;
    private static bool BeValidStorageKey(string? value) => Safe(() => StorageKey.Create(value!)) != null;
    private static bool BeValidMediaType(string? value) => Safe(() => MediaType.Create(value!)) != null;
    private static bool BeValidLanguage(string? value) => Safe(() => LanguageCode.Create(value!)) != null;
    private static bool BeValidStatus(string? value) =>
        string.IsNullOrWhiteSpace(value) || Enum.TryParse<MediaStatus>(value, ignoreCase: true, out var s)
            && s is MediaStatus.Draft or MediaStatus.Processing or MediaStatus.Ready;

    private static bool HaveRequiredDimensionsForImage(CreateMediaAssetCommand cmd) =>
        cmd.Width.HasValue && cmd.Height.HasValue;

    private static bool HaveRequiredDurationForAv(CreateMediaAssetCommand cmd) => cmd.DurationSeconds.HasValue;

    private static object? Safe(Func<object> factory)
    {
        try
        {
            return factory();
        }
        catch
        {
            return null;
        }
    }
}

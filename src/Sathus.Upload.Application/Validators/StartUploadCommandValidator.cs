using FluentValidation;
using Sathus.Media.Domain.ValueObjects;
using Sathus.Upload.Application.Commands.StartUpload;
using Sathus.Upload.Domain.Enums;

namespace Sathus.Upload.Application.Validators;

public sealed class StartUploadCommandValidator : AbstractValidator<StartUploadCommand>
{
    public StartUploadCommandValidator()
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

        RuleFor(x => x.ChunkSize)
            .GreaterThan(0).WithMessage("Chunk size must be greater than zero.")
            .LessThanOrEqualTo(x => x.Size).WithMessage("Chunk size cannot exceed file size.");

        RuleFor(x => x.Checksum)
            .Must(BeValidChecksum).When(x => !string.IsNullOrWhiteSpace(x.Checksum))
            .WithMessage("Checksum must be in the form 'algorithm:hex' (e.g. 'sha256:...').");

        RuleFor(x => x.IsFolder)
            .Equal(false).When(x => string.IsNullOrWhiteSpace(x.FolderPath))
            .WithMessage("FolderPath is required for folder uploads.");
    }

    private static bool BeValidFileName(string? value) => Safe(() => FileName.Create(value!)) != null;
    private static bool BeValidExtension(string? value) => Safe(() => FileExtension.Create(value!)) != null;
    private static bool BeValidMimeType(string? value) => Safe(() => MimeType.Create(value!)) != null;
    private static bool BeValidChecksum(string? value) => Safe(() => Sathus.Storage.Domain.ValueObjects.Checksum.Create("sha256", value!.Split(':')[1])) != null;

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

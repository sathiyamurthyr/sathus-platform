using FluentValidation;
using Sathus.Upload.Application.Commands.UploadChunk;

namespace Sathus.Upload.Application.Validators;

public sealed class UploadChunkCommandValidator : AbstractValidator<UploadChunkCommand>
{
    public UploadChunkCommandValidator()
    {
        RuleFor(x => x.SessionId)
            .NotEmpty().WithMessage("Session ID is required.");

        RuleFor(x => x.ChunkIndex)
            .GreaterThanOrEqualTo(0).WithMessage("Chunk index must be non-negative.");

        RuleFor(x => x.Data)
            .NotNull().WithMessage("Chunk data is required.")
            .Must(stream => stream.Length > 0).WithMessage("Chunk data cannot be empty.");

        RuleFor(x => x.Checksum)
            .Must(BeValidChecksum).When(x => !string.IsNullOrWhiteSpace(x.Checksum))
            .WithMessage("Checksum must be in the form 'algorithm:hex' (e.g. 'sha256:...').");
    }

    private static bool BeValidChecksum(string? value)
    {
        if (string.IsNullOrWhiteSpace(value)) return true;
        try
        {
            var parts = value.Split(':');
            return parts.Length == 2 && !string.IsNullOrWhiteSpace(parts[0]) && !string.IsNullOrWhiteSpace(parts[1]);
        }
        catch
        {
            return false;
        }
    }
}

using Sathus.SharedKernel.Exceptions;

namespace Sathus.Upload.Domain.Exceptions;

public sealed class UploadSessionNotFoundException : AppException
{
    public UploadSessionNotFoundException(Guid sessionId)
        : base($"Upload session '{sessionId}' was not found.")
    {
        SessionId = sessionId;
    }

    public Guid SessionId { get; }
}

public sealed class InvalidUploadStateException : AppException
{
    public InvalidUploadStateException(string message) : base(message)
    {
    }
}

public sealed class ChunkValidationException : AppException
{
    public ChunkValidationException(string message) : base(message)
    {
    }
}

public sealed class UploadQuotaExceededException : AppException
{
    public UploadQuotaExceededException(long requested, long allowed)
        : base($"Upload quota exceeded. Requested: {requested} bytes, Allowed: {allowed} bytes.")
    {
        Requested = requested;
        Allowed = allowed;
    }

    public long Requested { get; }
    public long Allowed { get; }
}

public sealed class DuplicateUploadException : AppException
{
    public DuplicateUploadException(string checksum)
        : base($"A file with checksum '{checksum}' has already been uploaded.")
    {
        Checksum = checksum;
    }

    public string Checksum { get; }
}

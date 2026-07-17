namespace Sathus.Storage.Domain.Exceptions;

public class UploadFailedException : StorageException
{
    public UploadFailedException(string key) : base($"Upload failed for object '{key}'.")
    {
        ErrorCode = "storage.upload_failed";
    }

    public UploadFailedException(string message, Exception innerException) : base(message, innerException)
    {
        ErrorCode = "storage.upload_failed";
    }
}

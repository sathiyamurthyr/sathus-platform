namespace Sathus.Storage.Domain.Exceptions;

public class DownloadFailedException : StorageException
{
    public DownloadFailedException(string key) : base($"Download failed for object '{key}'.")
    {
        ErrorCode = "storage.download_failed";
    }

    public DownloadFailedException(string message, Exception innerException) : base(message, innerException)
    {
        ErrorCode = "storage.download_failed";
    }
}

namespace Sathus.Storage.Domain.Exceptions;

public class StorageUnavailableException : StorageException
{
    public StorageUnavailableException(string provider) : base($"Storage provider '{provider}' is currently unavailable.")
    {
        ErrorCode = "storage.unavailable";
    }

    public StorageUnavailableException(string message, Exception innerException) : base(message, innerException)
    {
        ErrorCode = "storage.unavailable";
    }
}

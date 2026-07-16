namespace Sathus.Storage.Domain.Exceptions;

public class StorageException : Exception
{
    public StorageException(string message) : base(message)
    {
    }

    public StorageException(string message, Exception innerException) : base(message, innerException)
    {
    }

    public string? ErrorCode { get; init; }
}

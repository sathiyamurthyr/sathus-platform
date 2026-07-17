namespace Sathus.Storage.Domain.Exceptions;

public class ObjectNotFoundException : StorageException
{
    public ObjectNotFoundException(string key) : base($"Object '{key}' was not found.")
    {
        ErrorCode = "storage.object_not_found";
    }

    public ObjectNotFoundException(string message, Exception innerException) : base(message, innerException)
    {
        ErrorCode = "storage.object_not_found";
    }
}

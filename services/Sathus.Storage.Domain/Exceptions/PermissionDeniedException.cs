namespace Sathus.Storage.Domain.Exceptions;

public class PermissionDeniedException : StorageException
{
    public PermissionDeniedException(string operation, string key) : base($"Permission denied for operation '{operation}' on object '{key}'.")
    {
        ErrorCode = "storage.permission_denied";
    }
}

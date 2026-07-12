namespace Sathus.Identity.Application.Exceptions;

public sealed class PermissionAlreadyExistsException : AppException
{
    public PermissionAlreadyExistsException(string message) : base(message)
    {
    }
}

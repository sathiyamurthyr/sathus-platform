namespace Sathus.Identity.Application.Exceptions;

public sealed class PermissionNotFoundException : AppException
{
    public PermissionNotFoundException(string message) : base(message)
    {
    }
}

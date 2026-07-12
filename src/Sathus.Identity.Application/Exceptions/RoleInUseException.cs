namespace Sathus.Identity.Application.Exceptions;

public sealed class RoleInUseException : AppException
{
    public RoleInUseException(string message) : base(message)
    {
    }
}

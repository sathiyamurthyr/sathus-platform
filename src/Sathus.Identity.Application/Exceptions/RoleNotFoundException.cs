namespace Sathus.Identity.Application.Exceptions;

public sealed class RoleNotFoundException : AppException
{
    public RoleNotFoundException(string message) : base(message)
    {
    }
}

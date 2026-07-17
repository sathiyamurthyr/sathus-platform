namespace Sathus.Identity.Application.Exceptions;

public sealed class RoleAlreadyExistsException : AppException
{
    public RoleAlreadyExistsException(string message) : base(message)
    {
    }
}

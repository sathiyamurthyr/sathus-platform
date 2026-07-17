namespace Sathus.Identity.Application.Exceptions;

public sealed class UserNotFoundException : AppException
{
    public UserNotFoundException(string message) : base(message)
    {
    }
}

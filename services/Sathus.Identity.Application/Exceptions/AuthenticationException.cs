namespace Sathus.Identity.Application.Exceptions;

public sealed class AuthenticationException : AppException
{
    public AuthenticationException(string message) : base(message)
    {
    }
}

namespace Sathus.Identity.Application.Exceptions;

public sealed class InvalidTokenException : AppException
{
    public InvalidTokenException(string message) : base(message)
    {
    }
}

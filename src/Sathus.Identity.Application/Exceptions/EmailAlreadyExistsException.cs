namespace Sathus.Identity.Application.Exceptions;

public sealed class EmailAlreadyExistsException : AppException
{
    public EmailAlreadyExistsException(string message) : base(message)
    {
    }
}

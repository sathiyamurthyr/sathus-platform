namespace Sathus.Content.Domain.Exceptions;

public sealed class SlugAlreadyExistsException : AppException
{
    public SlugAlreadyExistsException(string message) : base(message) { }
}

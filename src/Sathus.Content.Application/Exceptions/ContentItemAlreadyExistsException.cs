namespace Sathus.Content.Application.Exceptions;

public sealed class ContentItemAlreadyExistsException : AppException
{
    public ContentItemAlreadyExistsException(string message) : base(message) { }
}

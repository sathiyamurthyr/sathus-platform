namespace Sathus.Content.Domain.Exceptions;

public sealed class ContentItemNotFoundException : AppException
{
    public ContentItemNotFoundException(string message) : base(message) { }
}

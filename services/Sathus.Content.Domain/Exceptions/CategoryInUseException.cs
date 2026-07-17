namespace Sathus.Content.Domain.Exceptions;

public sealed class CategoryInUseException : AppException
{
    public CategoryInUseException(string message) : base(message) { }
}

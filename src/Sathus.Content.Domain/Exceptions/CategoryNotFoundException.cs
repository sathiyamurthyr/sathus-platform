namespace Sathus.Content.Domain.Exceptions;

public sealed class CategoryNotFoundException : AppException
{
    public CategoryNotFoundException(string message) : base(message) { }
}

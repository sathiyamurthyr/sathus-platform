namespace Sathus.Content.Application.Exceptions;

public sealed class CategoryAlreadyExistsException : AppException
{
    public CategoryAlreadyExistsException(string message) : base(message) { }
}

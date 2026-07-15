using Sathus.SharedKernel.Exceptions;

namespace Sathus.Search.Domain.Exceptions;

public sealed class SearchInvalidQueryException : AppException
{
    public SearchInvalidQueryException(string message) : base(message) { }
}

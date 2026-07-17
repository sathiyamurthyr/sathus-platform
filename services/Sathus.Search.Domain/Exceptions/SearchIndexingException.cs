using Sathus.SharedKernel.Exceptions;

namespace Sathus.Search.Domain.Exceptions;

public sealed class SearchIndexingException : AppException
{
    public SearchIndexingException(string message) : base(message) { }
}

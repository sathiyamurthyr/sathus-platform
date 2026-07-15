using Sathus.SharedKernel.Exceptions;

namespace Sathus.Search.Domain.Exceptions;

public sealed class SearchProviderNotSupportedException : AppException
{
    public SearchProviderNotSupportedException(string provider) : base($"Search provider '{provider}' is not supported.") { }
}

using Sathus.SharedKernel.Exceptions;

namespace Sathus.Search.Domain.Exceptions;

public sealed class SearchIndexNotFoundException : NotFoundException
{
    public SearchIndexNotFoundException(Guid indexId) : base($"Search index with ID {indexId} was not found.") { }
    public SearchIndexNotFoundException(string code) : base($"Search index with code '{code}' was not found.") { }
}

using Sathus.SharedKernel.Exceptions;

namespace Sathus.Search.Domain.Exceptions;

public sealed class SearchDocumentNotFoundException : NotFoundException
{
    public SearchDocumentNotFoundException(Guid documentId) : base($"Search document with ID {documentId} was not found.") { }
}

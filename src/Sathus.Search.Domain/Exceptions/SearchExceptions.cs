using Sathus.Search.Domain.Enums;
using Sathus.SharedKernel.Exceptions;

namespace Sathus.Search.Domain.Exceptions;

public sealed class SearchIndexNotFoundException(Guid indexId) : AppException($"Search index '{indexId}' was not found.");
public sealed class SearchDocumentNotFoundException(Guid documentId) : AppException($"Search document '{documentId}' was not found.");
public sealed class SearchProviderNotSupportedException(SearchProviderType provider) : AppException($"Search provider '{provider}' is not supported.");
public sealed class SearchIndexingException(string message) : AppException(message);
public sealed class SearchInvalidQueryException(string message) : AppException(message);

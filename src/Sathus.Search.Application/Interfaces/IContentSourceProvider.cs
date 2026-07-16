using Sathus.Search.Domain.Entities;
using Sathus.Search.Domain.Enums;

namespace Sathus.Search.Application.Interfaces;

public interface IContentSourceProvider
{
    IndexSourceType SourceType { get; }
    Task<IReadOnlyList<SearchDocument>> GetDocumentsAsync(CancellationToken cancellationToken);
}

using Sathus.Search.Application.Interfaces;
using Sathus.Search.Domain.Entities;
using Sathus.Search.Domain.Enums;

namespace Sathus.Search.Infrastructure.Services.ContentSourceProviders;

public sealed class MediaContentSourceProvider : IContentSourceProvider
{
    public IndexSourceType SourceType => IndexSourceType.Media;

    public Task<IReadOnlyList<SearchDocument>> GetDocumentsAsync(CancellationToken cancellationToken)
    {
        return Task.FromResult<IReadOnlyList<SearchDocument>>(Array.Empty<SearchDocument>());
    }
}

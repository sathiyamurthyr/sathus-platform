using System.Diagnostics;
using MediatR;
using Microsoft.Extensions.Logging;
using Sathus.Search.Application.Interfaces;
using Sathus.Search.Domain.Entities;

namespace Sathus.Search.Infrastructure.Services;

public sealed class SearchIndexer : ISearchIndexer
{
    private readonly ISearchProvider _provider;
    private readonly ISearchRepository _repository;
    private readonly IMediator _mediator;
    private readonly ILogger<SearchIndexer> _logger;

    public SearchIndexer(ISearchProvider provider, ISearchRepository repository, IMediator mediator, ILogger<SearchIndexer> logger)
    {
        _provider = provider;
        _repository = repository;
        _mediator = mediator;
        _logger = logger;
    }

    public async Task IndexAsync(SearchDocument document, CancellationToken cancellationToken)
    {
        try
        {
            await _provider.IndexDocumentAsync(document, cancellationToken);
            document.AddDomainEvent(new SearchDocumentIndexedEvent(document.Id, document.ExternalId, document.SourceType));
            await _repository.SaveChangesAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to index document {DocumentId}", document.Id);
            throw new SearchIndexingException($"Failed to index document {document.Id}: {ex.Message}");
        }
    }

    public async Task IndexRangeAsync(IEnumerable<SearchDocument> documents, CancellationToken cancellationToken)
    {
        foreach (var document in documents)
        {
            await IndexAsync(document, cancellationToken);
        }
    }

    public async Task DeleteAsync(Guid documentId, CancellationToken cancellationToken)
    {
        var doc = await _repository.GetByIdAsync(documentId, cancellationToken);
        if (doc is null)
        {
            return;
        }

        await _provider.DeleteDocumentAsync(doc.ExternalId, doc.SourceType.ToString(), cancellationToken);
        doc.Archive(null);
        await _repository.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteBySourceAsync(IndexSourceType sourceType, CancellationToken cancellationToken)
    {
        var docs = await _repository.GetBySourceTypeAsync(sourceType, cancellationToken);
        foreach (var doc in docs)
        {
            await _provider.DeleteDocumentAsync(doc.ExternalId, doc.SourceType.ToString(), cancellationToken);
            doc.Archive(null);
        }

        if (docs.Count > 0)
        {
            await _repository.SaveChangesAsync(cancellationToken);
        }
    }

    public async Task RebuildAsync(Guid indexId, CancellationToken cancellationToken)
    {
        var index = await _repository.GetIndexWithDocumentsAsync(indexId, cancellationToken);
        if (index is null)
        {
            return;
        }

        await _provider.RebuildIndexAsync(index, cancellationToken);

        var docs = await _repository.GetByIndexAsync(indexId, cancellationToken);
        foreach (var doc in docs.Where(d => !d.IsDeleted))
        {
            await _provider.IndexDocumentAsync(doc, cancellationToken);
        }
    }

    public async Task<int> GetPendingCountAsync(CancellationToken cancellationToken)
    {
        var all = await _repository.GetAllAsync(cancellationToken);
        return all.Count(d => !d.IsDeleted);
    }
}

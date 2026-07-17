global using FluentAssertions;
global using Xunit;
global using Microsoft.Extensions.Logging;
global using Moq;
global using Sathus.Search.Application.Interfaces;
global using Sathus.Search.Domain.Entities;
global using Sathus.Search.Domain.Enums;
global using Sathus.Search.Domain.Events;
global using Sathus.Search.Infrastructure.Services;

namespace Sathus.Search.Tests.Infrastructure;

public class SearchIndexerTests
{
    [Fact]
    public async Task IndexAsync_Should_Call_Provider_And_Save()
    {
        var provider = new Mock<ISearchProvider>();
        var repository = new Mock<ISearchRepository>();
        var mediator = new Mock<MediatR.IMediator>();
        var logger = Mock.Of<ILogger<SearchIndexer>>();
        var indexer = new SearchIndexer(provider.Object, repository.Object, mediator.Object, logger);
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", null);

        await indexer.IndexAsync(doc, CancellationToken.None);

        provider.Verify(p => p.IndexDocumentAsync(doc, CancellationToken.None), Times.Once);
        repository.Verify(r => r.SaveChangesAsync(CancellationToken.None), Times.Once);
        doc.DomainEvents.Should().ContainSingle().Which.Should().BeOfType<SearchDocumentIndexedEvent>();
    }

    [Fact]
    public async Task IndexAsync_Should_Throw_SearchIndexingException_On_Failure()
    {
        var provider = new Mock<ISearchProvider>();
        provider.Setup(p => p.IndexDocumentAsync(It.IsAny<SearchDocument>(), It.IsAny<CancellationToken>())).ThrowsAsync(new InvalidOperationException("provider error"));
        var repository = new Mock<ISearchRepository>();
        var mediator = new Mock<MediatR.IMediator>();
        var logger = Mock.Of<ILogger<SearchIndexer>>();
        var indexer = new SearchIndexer(provider.Object, repository.Object, mediator.Object, logger);
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", null);

        var act = async () => await indexer.IndexAsync(doc, CancellationToken.None);

        await act.Should().ThrowAsync<SearchIndexingException>();
    }

    [Fact]
    public async Task IndexRangeAsync_Should_Index_All_Documents()
    {
        var provider = new Mock<ISearchProvider>();
        var repository = new Mock<ISearchRepository>();
        var mediator = new Mock<MediatR.IMediator>();
        var logger = Mock.Of<ILogger<SearchIndexer>>();
        var indexer = new SearchIndexer(provider.Object, repository.Object, mediator.Object, logger);
        var docs = new List<SearchDocument>
        {
            SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "T1", "C1", null),
            SearchDocument.Create(Guid.NewGuid(), "ext-2", IndexSourceType.Page, "T2", "C2", null)
        };

        await indexer.IndexRangeAsync(docs, CancellationToken.None);

        provider.Verify(p => p.IndexDocumentAsync(It.IsAny<SearchDocument>(), It.IsAny<CancellationToken>()), Times.Exactly(2));
    }

    [Fact]
    public async Task DeleteAsync_Should_Delete_When_Document_Exists()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", null);
        var provider = new Mock<ISearchProvider>();
        var repository = new Mock<ISearchRepository>();
        repository.Setup(r => r.GetByIdAsync(doc.Id, CancellationToken.None)).ReturnsAsync(doc);
        var mediator = new Mock<MediatR.IMediator>();
        var logger = Mock.Of<ILogger<SearchIndexer>>();
        var indexer = new SearchIndexer(provider.Object, repository.Object, mediator.Object, logger);

        await indexer.DeleteAsync(doc.Id, CancellationToken.None);

        provider.Verify(p => p.DeleteDocumentAsync(doc.ExternalId, doc.SourceType.ToString(), CancellationToken.None), Times.Once);
        doc.IsDeleted.Should().BeTrue();
        repository.Verify(r => r.SaveChangesAsync(CancellationToken.None), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_Should_Return_When_Document_Not_Found()
    {
        var provider = new Mock<ISearchProvider>();
        var repository = new Mock<ISearchRepository>();
        repository.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), CancellationToken.None)).ReturnsAsync((SearchDocument?)null);
        var mediator = new Mock<MediatR.IMediator>();
        var logger = Mock.Of<ILogger<SearchIndexer>>();
        var indexer = new SearchIndexer(provider.Object, repository.Object, mediator.Object, logger);

        await indexer.DeleteAsync(Guid.NewGuid(), CancellationToken.None);

        provider.Verify(p => p.DeleteDocumentAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<CancellationToken>()), Times.Never);
        repository.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task DeleteBySourceAsync_Should_Delete_All_By_SourceType()
    {
        var docs = new List<SearchDocument>
        {
            SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "T1", "C1", null),
            SearchDocument.Create(Guid.NewGuid(), "ext-2", IndexSourceType.Page, "T2", "C2", null)
        };
        var provider = new Mock<ISearchProvider>();
        var repository = new Mock<ISearchRepository>();
        repository.Setup(r => r.GetBySourceTypeAsync(IndexSourceType.Page, CancellationToken.None)).ReturnsAsync(docs);
        var mediator = new Mock<MediatR.IMediator>();
        var logger = Mock.Of<ILogger<SearchIndexer>>();
        var indexer = new SearchIndexer(provider.Object, repository.Object, mediator.Object, logger);

        await indexer.DeleteBySourceAsync(IndexSourceType.Page, CancellationToken.None);

        provider.Verify(p => p.DeleteDocumentAsync(It.IsAny<string>(), It.IsAny<string>(), CancellationToken.None), Times.Exactly(2));
        docs.All(d => d.IsDeleted).Should().BeTrue();
        repository.Verify(r => r.SaveChangesAsync(CancellationToken.None), Times.Once);
    }

    [Fact]
    public async Task DeleteBySourceAsync_Should_Not_Save_When_No_Documents()
    {
        var provider = new Mock<ISearchProvider>();
        var repository = new Mock<ISearchRepository>();
        repository.Setup(r => r.GetBySourceTypeAsync(IndexSourceType.Page, CancellationToken.None)).ReturnsAsync(new List<SearchDocument>());
        var mediator = new Mock<MediatR.IMediator>();
        var logger = Mock.Of<ILogger<SearchIndexer>>();
        var indexer = new SearchIndexer(provider.Object, repository.Object, mediator.Object, logger);

        await indexer.DeleteBySourceAsync(IndexSourceType.Page, CancellationToken.None);

        provider.Verify(p => p.DeleteDocumentAsync(It.IsAny<string>(), It.IsAny<string>(), CancellationToken.None), Times.Never);
        repository.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task RebuildAsync_Should_Rebuild_Index_When_Exists()
    {
        var index = SearchIndex.Create(Guid.NewGuid(), "Main", "main");
        var docs = new List<SearchDocument>
        {
            SearchDocument.Create(index.Id, "ext-1", IndexSourceType.Page, "T1", "C1", null),
            SearchDocument.Create(index.Id, "ext-2", IndexSourceType.Page, "T2", "C2", null)
        };
        var provider = new Mock<ISearchProvider>();
        var repository = new Mock<ISearchRepository>();
        repository.Setup(r => r.GetIndexWithDocumentsAsync(index.Id, CancellationToken.None)).ReturnsAsync(index);
        repository.Setup(r => r.GetByIndexAsync(index.Id, CancellationToken.None)).ReturnsAsync(docs);
        var mediator = new Mock<MediatR.IMediator>();
        var logger = Mock.Of<ILogger<SearchIndexer>>();
        var indexer = new SearchIndexer(provider.Object, repository.Object, mediator.Object, logger);

        await indexer.RebuildAsync(index.Id, CancellationToken.None);

        provider.Verify(p => p.RebuildIndexAsync(index, CancellationToken.None), Times.Once);
        provider.Verify(p => p.IndexDocumentAsync(It.IsAny<SearchDocument>(), CancellationToken.None), Times.Exactly(2));
    }

    [Fact]
    public async Task RebuildAsync_Should_Return_When_Index_Not_Found()
    {
        var provider = new Mock<ISearchProvider>();
        var repository = new Mock<ISearchRepository>();
        repository.Setup(r => r.GetIndexWithDocumentsAsync(It.IsAny<Guid>(), CancellationToken.None)).ReturnsAsync((SearchIndex?)null);
        var mediator = new Mock<MediatR.IMediator>();
        var logger = Mock.Of<ILogger<SearchIndexer>>();
        var indexer = new SearchIndexer(provider.Object, repository.Object, mediator.Object, logger);

        await indexer.RebuildAsync(Guid.NewGuid(), CancellationToken.None);

        provider.Verify(p => p.RebuildIndexAsync(It.IsAny<SearchIndex>(), CancellationToken.None), Times.Never);
    }

    [Fact]
    public async Task GetPendingCountAsync_Should_Return_Count_Of_NonDeleted_Indexes()
    {
        var indexes = new List<SearchIndex>
        {
            SearchIndex.Create(Guid.NewGuid(), "Index 1", "IDX1"),
            SearchIndex.Create(Guid.NewGuid(), "Index 2", "IDX2")
        };
        indexes[0].MarkDeleted(null, DateTime.UtcNow);
        var provider = new Mock<ISearchProvider>();
        var repository = new Mock<ISearchRepository>();
        repository.Setup(r => r.GetAllAsync(CancellationToken.None)).ReturnsAsync((IReadOnlyList<SearchIndex>)indexes);
        var mediator = new Mock<MediatR.IMediator>();
        var logger = Mock.Of<ILogger<SearchIndexer>>();
        var indexer = new SearchIndexer(provider.Object, repository.Object, mediator.Object, logger);

        var count = await indexer.GetPendingCountAsync(CancellationToken.None);

        count.Should().Be(1);
    }
}

namespace Sathus.Search.Tests.Application;

public class RebuildIndexCommandHandlerTests
{
    [Fact]
    public async Task Handle_Should_Rebuild_Index_And_Return_Response()
    {
        var index = SearchIndex.Create("Main", "MAIN", SearchProviderType.Elasticsearch);
        var repo = new Mock<ISearchRepository>();
        repo.Setup(r => r.GetIndexWithDocumentsAsync(index.Id, It.IsAny<CancellationToken>())).ReturnsAsync(index);
        repo.Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>())).ReturnsAsync(new List<SearchIndex> { index });
        var provider = new Mock<ISearchProvider>();
        var handler = new RebuildIndexCommandHandler(repo.Object, provider.Object);

        var response = await handler.Handle(new RebuildIndexCommand(index.Id), CancellationToken.None);

        response.Should().NotBeNull();
        response.IndexId.Should().Be(index.Id);
        response.Code.Should().Be("main");
        response.Status.Should().Be("completed");
        provider.Verify(p => p.RebuildIndexAsync(index, It.IsAny<CancellationToken>()), Times.Once);
        repo.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_When_Index_Not_Found_Should_Throw()
    {
        var repo = new Mock<ISearchRepository>();
        repo.Setup(r => r.GetIndexWithDocumentsAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>())).ReturnsAsync((SearchIndex?)null);
        var provider = new Mock<ISearchProvider>();
        var handler = new RebuildIndexCommandHandler(repo.Object, provider.Object);

        var act = async () => await handler.Handle(new RebuildIndexCommand(Guid.NewGuid()), CancellationToken.None);

        await act.Should().ThrowAsync<SearchIndexNotFoundException>();
    }
}

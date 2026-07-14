namespace Sathus.Search.Tests.Application;

public class GetIndexStatusQueryHandlerTests
{
    [Fact]
    public async Task Handle_Should_Return_Status_For_All_Indexes()
    {
        var index1 = SearchIndex.Create("Index 1", "IDX1", SearchProviderType.Elasticsearch);
        var index2 = SearchIndex.Create("Index 2", "IDX2", SearchProviderType.Elasticsearch);
        var repo = new Mock<ISearchRepository>();
        repo.Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>())).ReturnsAsync(new List<SearchIndex> { index1, index2 });
        repo.Setup(r => r.GetByIndexAsync(index1.Id, It.IsAny<CancellationToken>())).ReturnsAsync(new List<SearchDocument> { SearchDocument.Create(Guid.NewGuid(), "e1", IndexSourceType.Page, "T", "C"), SearchDocument.Create(Guid.NewGuid(), "e2", IndexSourceType.Page, "T", "C") });
        repo.Setup(r => r.GetByIndexAsync(index2.Id, It.IsAny<CancellationToken>())).ReturnsAsync(new List<SearchDocument> { SearchDocument.Create(Guid.NewGuid(), "e3", IndexSourceType.Page, "T", "C") });
        var handler = new GetIndexStatusQueryHandler(repo.Object);

        var response = await handler.Handle(new GetIndexStatusQuery(), CancellationToken.None);

        response.Should().HaveCount(2);
        response.Should().Contain(r => r.Code == "idx1" && r.DocumentCount == 2);
        response.Should().Contain(r => r.Code == "idx2" && r.DocumentCount == 1);
    }
}

namespace Sathus.Search.Tests.Application;

public class BulkIndexCommandHandlerTests
{
    [Fact]
    public async Task Handle_Should_Index_All_Items()
    {
        var repo = new Mock<ISearchRepository>();
        repo.Setup(r => r.GetByExternalIdAsync(It.IsAny<Guid>(), It.IsAny<string>(), It.IsAny<CancellationToken>())).ReturnsAsync((SearchDocument?)null);
        var handler = new BulkIndexCommandHandler(repo.Object);
        var items = new List<BulkIndexItem>
        {
            new("ext-1", IndexSourceType.Page, "Title 1", "Content 1"),
            new("ext-2", IndexSourceType.Page, "Title 2", "Content 2")
        };

        var response = await handler.Handle(new BulkIndexCommand(Guid.NewGuid(), items), CancellationToken.None);

        response.Indexed.Should().Be(2);
        response.Failed.Should().Be(0);
        repo.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Exactly(2));
    }
}

namespace Sathus.Search.Tests.Application;

public class IndexDocumentCommandHandlerTests
{
    [Fact]
    public async Task Handle_When_Document_Does_Not_Exist_Should_Create_And_Add()
    {
        var repo = new Mock<ISearchRepository>();
        repo.Setup(r => r.GetByExternalIdAsync(It.IsAny<Guid>(), It.IsAny<string>(), It.IsAny<CancellationToken>())).ReturnsAsync((SearchDocument?)null);
        var handler = new IndexDocumentCommandHandler(repo.Object);

        var response = await handler.Handle(
            new IndexDocumentCommand(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content"),
            CancellationToken.None);

        response.Should().NotBeNull();
        response.ExternalId.Should().Be("ext-1");
        response.SourceType.Should().Be(IndexSourceType.Page);
        response.Title.Should().Be("Title");
        repo.Verify(r => r.AddAsync(It.IsAny<SearchDocument>(), It.IsAny<CancellationToken>()), Times.Once);
        repo.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_When_Document_Exists_Should_Update_Not_Add()
    {
        var existing = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Old", "Old content");
        var repo = new Mock<ISearchRepository>();
        repo.Setup(r => r.GetByExternalIdAsync(It.IsAny<Guid>(), It.IsAny<string>(), It.IsAny<CancellationToken>())).ReturnsAsync(existing);
        var handler = new IndexDocumentCommandHandler(repo.Object);

        var response = await handler.Handle(
            new IndexDocumentCommand(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "New Title", "New content"),
            CancellationToken.None);

        response.Should().NotBeNull();
        response.Title.Should().Be("New Title");
        repo.Verify(r => r.AddAsync(It.IsAny<SearchDocument>(), It.IsAny<CancellationToken>()), Times.Never);
        repo.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}

namespace Sathus.Search.Tests.Application;

public class DeleteDocumentCommandHandlerTests
{
    [Fact]
    public async Task Handle_When_Document_Exists_Should_Archive()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content");
        var repo = new Mock<ISearchRepository>();
        repo.Setup(r => r.GetByIdAsync(doc.Id, It.IsAny<CancellationToken>())).ReturnsAsync(doc);
        var handler = new DeleteDocumentCommandHandler(repo.Object);

        var result = await handler.Handle(new DeleteDocumentCommand(doc.Id), CancellationToken.None);

        result.Should().Be(Unit.Value);
        doc.Status.Should().Be(DocumentStatus.Archived);
        repo.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_When_Document_Not_Found_Should_Throw()
    {
        var repo = new Mock<ISearchRepository>();
        repo.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>())).ReturnsAsync((SearchDocument?)null);
        var handler = new DeleteDocumentCommandHandler(repo.Object);

        var act = async () => await handler.Handle(new DeleteDocumentCommand(Guid.NewGuid()), CancellationToken.None);

        await act.Should().ThrowAsync<SearchDocumentNotFoundException>();
    }
}

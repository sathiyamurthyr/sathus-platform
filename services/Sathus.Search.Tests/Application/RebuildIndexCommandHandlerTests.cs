global using FluentAssertions;
global using Xunit;
global using Microsoft.Extensions.Logging;
global using Moq;
global using Sathus.Search.Application.Commands.RebuildIndex;
global using Sathus.Search.Application.Interfaces;
global using Sathus.Search.Domain.Entities;

namespace Sathus.Search.Tests.Application;

public class RebuildIndexCommandHandlerTests
{
    [Fact]
    public async Task Handle_Should_Rebuild_Index_And_Return_Response()
    {
        var index = SearchIndex.Create(Guid.NewGuid(), "Main", "main");
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
}

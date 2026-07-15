global using FluentAssertions;
global using Xunit;
global using Microsoft.Extensions.Logging;
global using Moq;
global using Sathus.Search.Application.Interfaces;
global using Sathus.Search.Application.Queries.GetStatus;
global using Sathus.Search.Domain.Entities;
global using Sathus.Search.Domain.Enums;

namespace Sathus.Search.Tests.Application;

public class GetIndexStatusQueryHandlerAdditionalTests
{
    [Fact]
    public async Task Handle_When_IndexId_Provided_Should_Return_Single_Status()
    {
        var index = SearchIndex.Create(Guid.NewGuid(), "Main", "main");
        var repo = new Mock<ISearchRepository>();
        repo.Setup(r => r.GetIndexWithDocumentsAsync(index.Id, CancellationToken.None)).ReturnsAsync(index);
        repo.Setup(r => r.GetByIndexAsync(index.Id, CancellationToken.None)).ReturnsAsync(new List<SearchDocument>());
        var handler = new GetIndexStatusQueryHandler(repo.Object);

        var response = await handler.Handle(new GetIndexStatusQuery(index.Id), CancellationToken.None);

        response.Should().HaveCount(1);
        response[0].Code.Should().Be("main");
        response[0].DocumentCount.Should().Be(0);
    }

    [Fact]
    public async Task Handle_When_IndexId_Provided_But_NotFound_Should_Return_Empty()
    {
        var repo = new Mock<ISearchRepository>();
        repo.Setup(r => r.GetIndexWithDocumentsAsync(It.IsAny<Guid>(), CancellationToken.None)).ReturnsAsync((SearchIndex?)null);
        var handler = new GetIndexStatusQueryHandler(repo.Object);

        var response = await handler.Handle(new GetIndexStatusQuery(Guid.NewGuid()), CancellationToken.None);

        response.Should().BeEmpty();
    }
}

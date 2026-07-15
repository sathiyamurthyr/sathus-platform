global using FluentAssertions;
global using Xunit;
global using Microsoft.Extensions.Logging;
global using Moq;
global using Sathus.Search.Application.Interfaces;
global using Sathus.Search.Application.Queries.GetStatus;
global using Sathus.Search.Domain.Entities;

namespace Sathus.Search.Tests.Application;

public class GetIndexStatusQueryHandlerTests
{
    [Fact]
    public async Task Handle_Should_Return_Status_For_All_Indexes()
    {
        var index1 = SearchIndex.Create(Guid.NewGuid(), "Index 1", "IDX1");
        var index2 = SearchIndex.Create(Guid.NewGuid(), "Index 2", "IDX2");
        var repo = new Mock<ISearchRepository>();
        repo.Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>())).ReturnsAsync(new List<SearchIndex> { index1, index2 });
        repo.Setup(r => r.GetByIndexAsync(index1.Id, It.IsAny<CancellationToken>())).ReturnsAsync(new List<SearchDocument> { SearchDocument.Create(Guid.NewGuid(), "e1", IndexSourceType.Page, "T", "C", null, null, null, null, "en", PermissionScope.Public), SearchDocument.Create(Guid.NewGuid(), "e2", IndexSourceType.Page, "T", "C", null, null, null, null, "en", PermissionScope.Public) });
        repo.Setup(r => r.GetByIndexAsync(index2.Id, It.IsAny<CancellationToken>())).ReturnsAsync(new List<SearchDocument> { SearchDocument.Create(Guid.NewGuid(), "e3", IndexSourceType.Page, "T", "C", null, null, null, null, "en", PermissionScope.Public) });
        var handler = new GetIndexStatusQueryHandler(repo.Object);

        var response = await handler.Handle(new GetIndexStatusQuery(), CancellationToken.None);

        response.Should().HaveCount(2);
        response.Should().Contain(r => r.Code == "IDX1" && r.DocumentCount == 2);
        response.Should().Contain(r => r.Code == "IDX2" && r.DocumentCount == 1);
    }
}

global using FluentAssertions;
global using Xunit;
global using Microsoft.Extensions.Logging;
global using Moq;
global using Sathus.Search.Application.Interfaces;
global using Sathus.Search.Application.Queries.Search;
global using Sathus.Search.Domain.Entities;
global using Sathus.Search.Domain.Enums;

namespace Sathus.Search.Tests.Application;

public class SearchQueryHandlerAdditionalTests
{
    [Fact]
    public async Task Handle_Should_Include_Permission_Filters_When_User_Provided()
    {
        var providerResult = new ProviderSearchResult
        {
            Total = 0,
            Page = 1,
            PageSize = 20,
            Items = Array.Empty<ProviderSearchResultItem>(),
            Facets = Array.Empty<ProviderSearchFacet>(),
            TookMs = 0
        };
        var provider = new Mock<ISearchProvider>();
        provider.Setup(p => p.SearchAsync(It.IsAny<ProviderSearchQuery>(), It.IsAny<CancellationToken>())).ReturnsAsync(providerResult);
        var permissionProvider = new Mock<ISearchPermissionProvider>();
        permissionProvider.Setup(p => p.GetFiltersForUserAsync("user-1", "admin", CancellationToken.None)).ReturnsAsync(new List<SearchFilter>
        {
            SearchFilter.Create("allowed_users", "user-1", FilterOperator.In)
        });
        var handler = new SearchQueryHandler(provider.Object, permissionProvider.Object);

        var response = await handler.Handle(new SearchQuery("query", UserId: "user-1", UserRoles: "admin"), CancellationToken.None);

        response.Total.Should().Be(0);
    }

    [Fact]
    public async Task Handle_Should_Not_Include_Permission_Filters_When_No_User()
    {
        var providerResult = new ProviderSearchResult
        {
            Total = 1,
            Page = 1,
            PageSize = 20,
            Items = new List<ProviderSearchResultItem>
            {
                new(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", null, null, "Author", 1.0, null)
            },
            Facets = Array.Empty<ProviderSearchFacet>(),
            TookMs = 10
        };
        var provider = new Mock<ISearchProvider>();
        provider.Setup(p => p.SearchAsync(It.IsAny<ProviderSearchQuery>(), It.IsAny<CancellationToken>())).ReturnsAsync(providerResult);
        var permissionProvider = new Mock<ISearchPermissionProvider>();
        var handler = new SearchQueryHandler(provider.Object, permissionProvider.Object);

        var response = await handler.Handle(new SearchQuery("query"), CancellationToken.None);

        response.Total.Should().Be(1);
        permissionProvider.Verify(p => p.GetFiltersForUserAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<CancellationToken>()), Times.Never);
    }
}

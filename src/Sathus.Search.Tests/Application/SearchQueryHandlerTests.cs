namespace Sathus.Search.Tests.Application;

public class SearchQueryHandlerTests
{
    [Fact]
    public async Task Handle_Should_Map_Provider_Result_To_Response()
    {
        var providerResult = new ProviderSearchResult
        {
            Total = 1,
            Page = 1,
            PageSize = 20,
            Items = new List<ProviderSearchResultItem>
            {
                new(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", "http://url", "http://img", "Author", 1.0, new List<string> { "highlight" })
            },
            Facets = new List<ProviderSearchFacet>
            {
                new("category", FacetType.Terms, new List<ProviderFacetValue> { new("tech", 5, true) })
            },
            TookMs = 42
        };
        var provider = new Mock<ISearchProvider>();
        provider.Setup(p => p.SearchAsync(It.IsAny<ProviderSearchQuery>(), It.IsAny<CancellationToken>())).ReturnsAsync(providerResult);
        var permissionProvider = new Mock<ISearchPermissionProvider>();
        permissionProvider.Setup(p => p.GetFiltersForUserAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<CancellationToken>())).ReturnsAsync(new List<SearchFilter>());
        var handler = new SearchQueryHandler(provider.Object, permissionProvider.Object);

        var response = await handler.Handle(new SearchQuery("query"), CancellationToken.None);

        response.Total.Should().Be(1);
        response.Items.Should().HaveCount(1);
        response.Items[0].Title.Should().Be("Title");
        response.Facets.Should().HaveCount(1);
        response.Facets[0].FieldName.Should().Be("category");
        response.TookMs.Should().Be(42);
    }

    [Fact]
    public async Task Handle_Should_Invoke_Permission_Provider_When_UserId_Set()
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
        permissionProvider.Setup(p => p.GetFiltersForUserAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<CancellationToken>())).ReturnsAsync(new List<SearchFilter>());
        var handler = new SearchQueryHandler(provider.Object, permissionProvider.Object);

        await handler.Handle(new SearchQuery("query", UserId: "user-1"), CancellationToken.None);

        permissionProvider.Verify(p => p.GetFiltersForUserAsync("user-1", It.IsAny<string>(), It.IsAny<CancellationToken>()), Times.Once);
    }
}

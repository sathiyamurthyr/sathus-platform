namespace Sathus.Search.Tests.Application;

public class SuggestQueryHandlerTests
{
    [Fact]
    public async Task Handle_Should_Return_Suggestions_Limited_By_Limit()
    {
        var suggestions = new List<ProviderSearchSuggestion>
        {
            new("suggestion 1", "term", 1.0),
            new("suggestion 2", "term", 0.8),
            new("suggestion 3", "term", 0.6)
        };
        var provider = new Mock<ISearchProvider>();
        provider.Setup(p => p.GetSuggestionsAsync("query", null, It.IsAny<CancellationToken>())).ReturnsAsync(suggestions);
        var handler = new SuggestQueryHandler(provider.Object);

        var response = await handler.Handle(new SuggestQuery("query", Limit: 2), CancellationToken.None);

        response.Should().HaveCount(2);
        response[0].Text.Should().Be("suggestion 1");
        response[1].Text.Should().Be("suggestion 2");
    }
}

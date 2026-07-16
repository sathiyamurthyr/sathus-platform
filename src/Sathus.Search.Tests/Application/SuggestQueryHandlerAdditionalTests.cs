global using FluentAssertions;
global using Xunit;
global using Microsoft.Extensions.Logging;
global using Moq;
global using Sathus.Search.Application.Interfaces;
global using Sathus.Search.Application.Queries.Suggest;
global using Sathus.Search.Domain.Enums;

namespace Sathus.Search.Tests.Application;

public class SuggestQueryHandlerAdditionalTests
{
    [Fact]
    public async Task Handle_Should_Return_Empty_When_Query_Is_Null()
    {
        var provider = new Mock<ISearchProvider>();
        var handler = new SuggestQueryHandler(provider.Object);

        var response = await handler.Handle(new SuggestQuery(null!), CancellationToken.None);

        response.Should().BeEmpty();
        provider.Verify(p => p.GetSuggestionsAsync(It.IsAny<string>(), It.IsAny<string?>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Should_Return_Empty_When_Query_Is_Empty()
    {
        var provider = new Mock<ISearchProvider>();
        var handler = new SuggestQueryHandler(provider.Object);

        var response = await handler.Handle(new SuggestQuery(""), CancellationToken.None);

        response.Should().BeEmpty();
        provider.Verify(p => p.GetSuggestionsAsync(It.IsAny<string>(), It.IsAny<string?>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Should_Return_Empty_When_Provider_Returns_Empty()
    {
        var provider = new Mock<ISearchProvider>();
        provider.Setup(p => p.GetSuggestionsAsync("query", null, CancellationToken.None)).ReturnsAsync(Array.Empty<ProviderSearchSuggestion>());
        var handler = new SuggestQueryHandler(provider.Object);

        var response = await handler.Handle(new SuggestQuery("query"), CancellationToken.None);

        response.Should().BeEmpty();
    }
}

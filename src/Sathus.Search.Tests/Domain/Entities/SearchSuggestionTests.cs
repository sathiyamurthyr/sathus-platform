global using FluentAssertions;
global using Xunit;
global using Sathus.Search.Domain.Entities;
global using Sathus.Search.Domain.ValueObjects;

namespace Sathus.Search.Tests.Domain.Entities;

public class SearchSuggestionTests
{
    [Fact]
    public void Constructor_Should_Throw_When_Text_Is_NullOrWhiteSpace()
    {
        var act = () => new SearchSuggestion(SearchSuggestionId.CreateUnique(), Guid.NewGuid(), "  ");

        act.Should().Throw<ArgumentException>().WithMessage("*Text is required*");
    }

    [Fact]
    public void Constructor_Should_Set_Defaults()
    {
        var id = SearchSuggestionId.CreateUnique();
        var indexId = Guid.NewGuid();

        var suggestion = new SearchSuggestion(id, indexId, "test");

        suggestion.Id.Should().Be(id);
        suggestion.IndexId.Should().Be(indexId);
        suggestion.Text.Should().Be("test");
        suggestion.Count.Should().Be(0);
        suggestion.LastUsedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void Create_Should_Return_New_Suggestion()
    {
        var suggestion = SearchSuggestion.Create(SearchSuggestionId.CreateUnique(), Guid.NewGuid(), "search term");

        suggestion.Should().NotBeNull();
        suggestion.Text.Should().Be("search term");
    }

    [Fact]
    public void Increment_Should_Increase_Count_And_Update_Date()
    {
        var suggestion = SearchSuggestion.Create(SearchSuggestionId.CreateUnique(), Guid.NewGuid(), "term");
        var initialDate = suggestion.LastUsedAt;

        suggestion.Increment();

        suggestion.Count.Should().Be(1);
        suggestion.LastUsedAt.Should().BeAfter(initialDate);
    }

    [Fact]
    public void Increment_Should_Accumulate_Count()
    {
        var suggestion = SearchSuggestion.Create(SearchSuggestionId.CreateUnique(), Guid.NewGuid(), "term");

        suggestion.Increment();
        suggestion.Increment();
        suggestion.Increment();

        suggestion.Count.Should().Be(3);
    }

    [Fact]
    public void Update_Should_Change_Text()
    {
        var suggestion = SearchSuggestion.Create(SearchSuggestionId.CreateUnique(), Guid.NewGuid(), "old");

        suggestion.Update("new text");

        suggestion.Text.Should().Be("new text");
    }

    [Fact]
    public void Update_Should_Keep_Original_When_Empty()
    {
        var suggestion = SearchSuggestion.Create(SearchSuggestionId.CreateUnique(), Guid.NewGuid(), "original");

        suggestion.Update("  ");

        suggestion.Text.Should().Be("original");
    }
}

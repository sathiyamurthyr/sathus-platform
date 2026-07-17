global using FluentAssertions;
global using Xunit;
global using Sathus.Search.Domain.Entities;
global using Sathus.Search.Domain.ValueObjects;

namespace Sathus.Search.Tests.Domain.Entities;

public class SearchHighlightTests
{
    [Fact]
    public void Constructor_Should_Throw_When_FieldName_Is_NullOrWhiteSpace()
    {
        var act = () => new SearchHighlight(SearchHighlightId.CreateUnique(), Guid.NewGuid(), "  ", null);

        act.Should().Throw<ArgumentException>().WithMessage("*FieldName is required*");
    }

    [Fact]
    public void Constructor_Should_Set_Properties()
    {
        var id = SearchHighlightId.CreateUnique();
        var indexId = Guid.NewGuid();

        var highlight = new SearchHighlight(id, indexId, "title", "<mark>...</mark>");

        highlight.Id.Should().Be(id);
        highlight.IndexId.Should().Be(indexId);
        highlight.FieldName.Should().Be("title");
        highlight.Options.Should().Be("<mark>...</mark>");
    }

    [Fact]
    public void Create_Should_Return_New_Highlight()
    {
        var highlight = SearchHighlight.Create(SearchHighlightId.CreateUnique(), Guid.NewGuid(), "content");

        highlight.Should().NotBeNull();
        highlight.FieldName.Should().Be("content");
    }

    [Fact]
    public void CreateUnique_Should_Generate_New_Id()
    {
        var highlight = SearchHighlight.CreateUnique(Guid.NewGuid(), "content");

        highlight.Id.Value.Should().NotBe(Guid.Empty);
        highlight.FieldName.Should().Be("content");
    }

    [Fact]
    public void Update_Should_Change_Fields()
    {
        var highlight = SearchHighlight.CreateUnique(Guid.NewGuid(), "old_field", null);

        highlight.Update("new_field", "{\"pre_tags\":[\"<b>\"],\"post_tags\":[\"</b>\"]}");

        highlight.FieldName.Should().Be("new_field");
        highlight.Options.Should().Be("{\"pre_tags\":[\"<b>\"],\"post_tags\":[\"</b>\"]}");
    }

    [Fact]
    public void Update_Should_Keep_Original_When_FieldName_Empty()
    {
        var highlight = SearchHighlight.CreateUnique(Guid.NewGuid(), "title", "<mark>...</mark>");

        highlight.Update("  ", null);

        highlight.FieldName.Should().Be("title");
        highlight.Options.Should().BeNull();
    }

    [Fact]
    public void Update_Should_Set_Options_When_Provided()
    {
        var highlight = SearchHighlight.CreateUnique(Guid.NewGuid(), "title", null);

        highlight.Update("title", "<em>...</em>");

        highlight.FieldName.Should().Be("title");
        highlight.Options.Should().Be("<em>...</em>");
    }
}

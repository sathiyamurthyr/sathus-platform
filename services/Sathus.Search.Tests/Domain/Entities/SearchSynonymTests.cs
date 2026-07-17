global using FluentAssertions;
global using Xunit;
global using Sathus.Search.Domain.Entities;
global using Sathus.Search.Domain.ValueObjects;

namespace Sathus.Search.Tests.Domain.Entities;

public class SearchSynonymTests
{
    [Fact]
    public void Constructor_Should_Throw_When_From_Is_NullOrWhiteSpace()
    {
        var act = () => new SearchSynonym(SearchSynonymId.CreateUnique(), Guid.NewGuid(), "  ", "to");

        act.Should().Throw<ArgumentException>().WithMessage("*From is required*");
    }

    [Fact]
    public void Constructor_Should_Throw_When_To_Is_NullOrWhiteSpace()
    {
        var act = () => new SearchSynonym(SearchSynonymId.CreateUnique(), Guid.NewGuid(), "from", "  ");

        act.Should().Throw<ArgumentException>().WithMessage("*To is required*");
    }

    [Fact]
    public void Constructor_Should_Set_Properties()
    {
        var id = SearchSynonymId.CreateUnique();
        var indexId = Guid.NewGuid();

        var synonym = new SearchSynonym(id, indexId, "phone", "mobile");

        synonym.Id.Should().Be(id);
        synonym.IndexId.Should().Be(indexId);
        synonym.From.Should().Be("phone");
        synonym.To.Should().Be("mobile");
    }

    [Fact]
    public void Create_Should_Return_New_Synonym()
    {
        var synonym = SearchSynonym.Create(SearchSynonymId.CreateUnique(), Guid.NewGuid(), "car", "automobile");

        synonym.Should().NotBeNull();
        synonym.From.Should().Be("car");
    }

    [Fact]
    public void CreateUnique_Should_Generate_New_Id()
    {
        var synonym = SearchSynonym.CreateUnique(Guid.NewGuid(), "car", "automobile");

        synonym.Id.Value.Should().NotBe(Guid.Empty);
        synonym.From.Should().Be("car");
    }

    [Fact]
    public void Update_Should_Change_Fields()
    {
        var synonym = SearchSynonym.CreateUnique(Guid.NewGuid(), "old", "old_to");

        synonym.Update("new", "new_to");

        synonym.From.Should().Be("new");
        synonym.To.Should().Be("new_to");
    }

    [Fact]
    public void Update_Should_Keep_Original_When_Empty()
    {
        var synonym = SearchSynonym.CreateUnique(Guid.NewGuid(), "original", "original_to");

        synonym.Update("  ", "  ");

        synonym.From.Should().Be("original");
        synonym.To.Should().Be("original_to");
    }
}

global using FluentAssertions;
global using Xunit;
global using Sathus.Search.Domain.Entities;
global using Sathus.Search.Domain.ValueObjects;

namespace Sathus.Search.Tests.Domain.Entities;

public class SearchRankingTests
{
    [Fact]
    public void Constructor_Should_Throw_When_Name_Is_NullOrWhiteSpace()
    {
        var act = () => new SearchRanking(SearchRankingId.CreateUnique(), Guid.NewGuid(), "  ", "query", 1.0);

        act.Should().Throw<ArgumentException>().WithMessage("*Name is required*");
    }

    [Fact]
    public void Constructor_Should_Throw_When_Query_Is_NullOrWhiteSpace()
    {
        var act = () => new SearchRanking(SearchRankingId.CreateUnique(), Guid.NewGuid(), "name", "  ", 1.0);

        act.Should().Throw<ArgumentException>().WithMessage("*Query is required*");
    }

    [Fact]
    public void Constructor_Should_Set_Properties()
    {
        var id = SearchRankingId.CreateUnique();
        var indexId = Guid.NewGuid();

        var ranking = new SearchRanking(id, indexId, "Boost Featured", "featured", 2.5);

        ranking.Id.Should().Be(id);
        ranking.IndexId.Should().Be(indexId);
        ranking.Name.Should().Be("Boost Featured");
        ranking.Query.Should().Be("featured");
        ranking.Boost.Should().Be(2.5);
    }

    [Fact]
    public void Create_Should_Return_New_Ranking()
    {
        var ranking = SearchRanking.Create(SearchRankingId.CreateUnique(), Guid.NewGuid(), "Popular", "popular", 1.5);

        ranking.Should().NotBeNull();
        ranking.Name.Should().Be("Popular");
    }

    [Fact]
    public void CreateUnique_Should_Generate_New_Id()
    {
        var ranking = SearchRanking.CreateUnique(Guid.NewGuid(), "Popular", "popular");

        ranking.Id.Value.Should().NotBe(Guid.Empty);
        ranking.Name.Should().Be("Popular");
    }

    [Fact]
    public void Update_Should_Change_Fields()
    {
        var ranking = SearchRanking.CreateUnique(Guid.NewGuid(), "old", "old_query", 1.0);

        ranking.Update("new", "new_query", 3.0);

        ranking.Name.Should().Be("new");
        ranking.Query.Should().Be("new_query");
        ranking.Boost.Should().Be(3.0);
    }

    [Fact]
    public void Update_Should_Keep_Original_When_Empty()
    {
        var ranking = SearchRanking.CreateUnique(Guid.NewGuid(), "name", "query", 1.5);

        ranking.Update("  ", "  ", 1.5);

        ranking.Name.Should().Be("name");
        ranking.Query.Should().Be("query");
        ranking.Boost.Should().Be(1.5);
    }
}

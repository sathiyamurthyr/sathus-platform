namespace Sathus.Search.Tests.Infrastructure;

public class SearchRankerTests
{
    [Fact]
    public void CalculateScore_Should_Return_Base_Score_When_Query_Empty()
    {
        var ranker = new SearchRanker(Mock.Of<ILogger<SearchRanker>>());
        var item = new SearchResultItem(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", "http://url", "http://img", "Author", 5.0, null);
        var rankings = new List<SearchRanking>();

        var score = ranker.CalculateScore(item, rankings, "");

        score.Should().Be(5.0);
    }

    [Fact]
    public void CalculateScore_Should_Multiply_By_Boost_When_Query_Matches()
    {
        var ranker = new SearchRanker(Mock.Of<ILogger<SearchRanker>>());
        var item = new SearchResultItem(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", "http://url", "http://img", "Author", 5.0, null);
        var ranking = SearchRanking.Create(Guid.NewGuid(), "Boost", "featured", 2.0, 1);

        var score = ranker.CalculateScore(item, new List<SearchRanking> { ranking }, "featured");

        score.Should().Be(10.0);
    }

    [Fact]
    public void CalculateScore_Should_Skip_Disabled_Rankings()
    {
        var ranker = new SearchRanker(Mock.Of<ILogger<SearchRanker>>());
        var item = new SearchResultItem(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", "http://url", "http://img", "Author", 5.0, null);
        var ranking = SearchRanking.Create(Guid.NewGuid(), "Boost", "featured", 2.0, 1);
        ranking.Update("Boost", "featured", 2.0, 1, false);

        var score = ranker.CalculateScore(item, new List<SearchRanking> { ranking }, "featured");

        score.Should().Be(5.0);
    }

    [Fact]
    public void CalculateScore_Should_Skip_When_Query_Does_Not_Match()
    {
        var ranker = new SearchRanker(Mock.Of<ILogger<SearchRanker>>());
        var item = new SearchResultItem(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", "http://url", "http://img", "Author", 5.0, null);
        var ranking = SearchRanking.Create(Guid.NewGuid(), "Boost", "featured", 2.0, 1);

        var score = ranker.CalculateScore(item, new List<SearchRanking> { ranking }, "other");

        score.Should().Be(5.0);
    }
}

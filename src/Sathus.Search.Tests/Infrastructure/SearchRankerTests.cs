global using FluentAssertions;
global using Xunit;
global using Microsoft.Extensions.Logging;
global using Moq;
global using Sathus.Search.Application.DTOs;
global using Sathus.Search.Application.Interfaces;
global using Sathus.Search.Domain.Entities;
global using Sathus.Search.Domain.Enums;
global using Sathus.Search.Domain.ValueObjects;
global using Sathus.Search.Infrastructure.Services;

namespace Sathus.Search.Tests.Infrastructure;

public class SearchRankerTests
{
    [Fact]
    public void CalculateScore_Should_Return_Base_Score_When_Query_Empty()
    {
        var ranker = new SearchRanker(Mock.Of<ILogger<SearchRanker>>());
        var item = new SearchResultItem(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", "http://url", "http://img", "Author", 5.0, null);

        var score = ranker.CalculateScore(item, new List<SearchRanking>(), "");

        score.Should().Be(5.0);
    }

    [Fact]
    public void CalculateScore_Should_Multiply_By_Boost_When_Query_Matches()
    {
        var ranker = new SearchRanker(Mock.Of<ILogger<SearchRanker>>());
        var item = new SearchResultItem(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", "http://url", "http://img", "Author", 5.0, null);
        var ranking = SearchRanking.CreateUnique(Guid.NewGuid(), "Boost", "featured", 2.0);

        var score = ranker.CalculateScore(item, new List<SearchRanking> { ranking }, "featured");

        score.Should().Be(10.0);
    }

    [Fact]
    public void CalculateScore_Should_Skip_When_Query_Does_Not_Match()
    {
        var ranker = new SearchRanker(Mock.Of<ILogger<SearchRanker>>());
        var item = new SearchResultItem(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", "http://url", "http://img", "Author", 5.0, null);
        var ranking = SearchRanking.CreateUnique(Guid.NewGuid(), "Boost", "featured", 2.0);

        var score = ranker.CalculateScore(item, new List<SearchRanking> { ranking }, "other");

        score.Should().Be(5.0);
    }
}

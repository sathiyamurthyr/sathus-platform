global using FluentAssertions;
global using Xunit;
global using Microsoft.Extensions.Logging;
global using Moq;
global using Sathus.Search.Application.Interfaces;
global using Sathus.Search.Application.Queries.Search;
global using Sathus.Search.Application.Queries.Suggest;
global using Sathus.Search.Domain.Entities;
global using Sathus.Search.Domain.Enums;
global using Sathus.Search.Domain.ValueObjects;
global using Sathus.Search.Infrastructure.Services;

namespace Sathus.Search.Tests.Application.Queries;

public class SearchQueryTests
{
    [Fact]
    public void SearchQuery_Should_Have_Default_Values()
    {
        var query = new SearchQuery("test");

        query.Query.Should().Be("test");
        query.IndexId.Should().BeNull();
        query.Filters.Should().BeNull();
        query.Sort.Should().BeNull();
        query.Pagination.Should().BeNull();
        query.IncludeFacets.Should().BeTrue();
        query.IncludeHighlights.Should().BeTrue();
        query.IncludeSuggestions.Should().BeTrue();
        query.Fuzzy.Should().BeTrue();
        query.HighlightPreTag.Should().BeNull();
        query.HighlightPostTag.Should().BeNull();
        query.UserId.Should().BeNull();
        query.UserRoles.Should().BeNull();
    }

    [Fact]
    public void SearchQuery_Should_Accept_All_Parameters()
    {
        var pagination = SearchPagination.Create(2, 10);
        var filters = new List<SearchFilter> { SearchFilter.Create("field", "value", FilterOperator.Equals) };
        var sort = new List<SearchSort> { SearchSort.Create("title", SortDirection.Asc) };

        var query = new SearchQuery("test", Guid.NewGuid(), filters, sort, pagination, false, true, false, false, "<em>", "</em>", "user-1", "admin,editor");

        query.Query.Should().Be("test");
        query.IndexId.Should().NotBeNull();
        query.IncludeFacets.Should().BeFalse();
        query.Fuzzy.Should().BeFalse();
        query.HighlightPreTag.Should().Be("<em>");
        query.HighlightPostTag.Should().Be("</em>");
        query.UserId.Should().Be("user-1");
        query.UserRoles.Should().Be("admin,editor");
    }
}

public class SuggestQueryTests
{
    [Fact]
    public void SuggestQuery_Should_Have_Default_Values()
    {
        var query = new SuggestQuery("test");

        query.Query.Should().Be("test");
        query.IndexId.Should().BeNull();
        query.DocumentType.Should().BeNull();
        query.Limit.Should().Be(8);
    }

    [Fact]
    public void SuggestQuery_Should_Accept_All_Parameters()
    {
        var query = new SuggestQuery("test", Guid.NewGuid(), "page", 5);

        query.IndexId.Should().NotBeNull();
        query.DocumentType.Should().Be("page");
        query.Limit.Should().Be(5);
    }
}

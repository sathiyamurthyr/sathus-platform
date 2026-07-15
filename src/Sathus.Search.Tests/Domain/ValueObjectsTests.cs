global using FluentAssertions;
global using Xunit;
global using Sathus.Search.Domain.Enums;
global using Sathus.Search.Domain.ValueObjects;

namespace Sathus.Search.Tests.Domain;

public class ValueObjectsTests
{
    [Fact]
    public void SearchFilter_Create_Should_Work()
    {
        var filter = SearchFilter.Create("field", "value", FilterOperator.Equals);

        filter.Field.Should().Be("field");
        filter.Value.Should().Be("value");
        filter.Operator.Should().Be(FilterOperator.Equals);
    }

    [Fact]
    public void SearchPagination_Create_Should_Validate_Range()
    {
        var pagination = SearchPagination.Create(1, 20);

        pagination.Page.Should().Be(1);
        pagination.PageSize.Should().Be(20);
        pagination.Offset.Should().Be(0);
    }

    [Fact]
    public void SearchSort_Create_Should_Trim_Field()
    {
        var sort = SearchSort.Create("  title  ", SortDirection.Desc);

        sort.Field.Should().Be("title");
        sort.Direction.Should().Be(SortDirection.Desc);
    }

    [Fact]
    public void SearchScore_Create_Should_Throw_On_NaN()
    {
        var act = () => SearchScore.Create(double.NaN);

        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void SearchScore_Implicit_Conversion_Should_Work()
    {
        SearchScore score = SearchScore.Create(3.14);

        double value = score;

        value.Should().Be(3.14);
    }
}

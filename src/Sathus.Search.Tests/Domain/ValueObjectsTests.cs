namespace Sathus.Search.Tests.Domain;

public class ValueObjectsTests
{
    [Fact]
    public void SearchFilter_Create_Should_Trim_Values()
    {
        var filter = SearchFilter.Create("  field  ", "  value  ", "  IN  ");

        filter.Field.Should().Be("field");
        filter.Value.Should().Be("value");
        filter.Operator.Should().Be("IN");
    }

    [Fact]
    public void SearchFilter_Create_Should_Throw_On_Empty_Field()
    {
        var act = () => SearchFilter.Create("", "value");

        act.Should().Throw<ArgumentException>().WithMessage("Field cannot be empty.*");
    }

    [Fact]
    public void SearchFilter_Create_Should_Throw_On_Null_Value()
    {
        var act = () => SearchFilter.Create("field", null!);

        act.Should().Throw<ArgumentNullException>();
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
    public void SearchPagination_Create_Should_Throw_On_Page_Less_Than_One()
    {
        var act = () => SearchPagination.Create(0, 20);

        act.Should().Throw<ArgumentException>().WithMessage("Page must be >= 1.*");
    }

    [Fact]
    public void SearchPagination_Create_Should_Throw_On_PageSize_Out_Of_Range()
    {
        var act = () => SearchPagination.Create(1, 0);

        act.Should().Throw<ArgumentException>().WithMessage("PageSize must be between 1 and 100.*");
    }

    [Fact]
    public void SearchPagination_Create_Should_Throw_On_PageSize_Above_100()
    {
        var act = () => SearchPagination.Create(1, 101);

        act.Should().Throw<ArgumentException>().WithMessage("PageSize must be between 1 and 100.*");
    }

    [Fact]
    public void SearchSort_Create_Should_Trim_Field()
    {
        var sort = SearchSort.Create("  title  ", SortDirection.Desc);

        sort.Field.Should().Be("title");
        sort.Direction.Should().Be(SortDirection.Desc);
    }

    [Fact]
    public void SearchSort_Create_Should_Throw_On_Empty_Field()
    {
        var act = () => SearchSort.Create("", SortDirection.Asc);

        act.Should().Throw<ArgumentException>().WithMessage("Field cannot be empty.*");
    }

    [Fact]
    public void SearchScore_Create_Should_Throw_On_Negative()
    {
        var act = () => SearchScore.Create(-1.0);

        act.Should().Throw<ArgumentException>().WithMessage("Score cannot be negative.*");
    }

    [Fact]
    public void SearchScore_Zero_Should_Work()
    {
        var score = SearchScore.Zero;

        score.Value.Should().Be(0);
    }

    [Fact]
    public void SearchScore_Implicit_Conversion_Should_Work()
    {
        SearchScore score = SearchScore.Create(3.14);

        double value = score;

        value.Should().Be(3.14);
    }
}

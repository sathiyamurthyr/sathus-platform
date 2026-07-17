global using FluentAssertions;
global using Xunit;
global using Sathus.SharedKernel.Paging;

namespace Sathus.Search.Tests.SharedKernel;

public class PagedResultTests
{
    [Fact]
    public void Create_Should_Set_Properties()
    {
        var items = new[] { 1, 2, 3 };
        var result = new PagedResult<int>(items, 1, 10, 3);

        result.Items.Should().BeEquivalentTo(items);
        result.Page.Should().Be(1);
        result.PageSize.Should().Be(10);
        result.TotalCount.Should().Be(3);
    }

    [Fact]
    public void TotalPages_Should_Calculate_Correctly()
    {
        var result = new PagedResult<int>(new[] { 1, 2, 3 }, 1, 10, 25);

        result.TotalPages.Should().Be(3);
    }
}

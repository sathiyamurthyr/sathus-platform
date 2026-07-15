global using FluentAssertions;
global using Xunit;
global using Sathus.Search.Domain;

namespace Sathus.Search.Tests.Domain;

public class SearchPermissionsTests
{
    [Fact]
    public void Read_Should_Have_Correct_Value()
    {
        SearchPermissions.Read.Should().Be("search.read");
    }

    [Fact]
    public void Manage_Should_Have_Correct_Value()
    {
        SearchPermissions.Manage.Should().Be("search.manage");
    }

    [Fact]
    public void Reindex_Should_Have_Correct_Value()
    {
        SearchPermissions.Reindex.Should().Be("search.reindex");
    }

    [Fact]
    public void All_Should_Contain_All_Permissions()
    {
        SearchPermissions.All.Should().Contain(SearchPermissions.Read);
        SearchPermissions.All.Should().Contain(SearchPermissions.Manage);
        SearchPermissions.All.Should().Contain(SearchPermissions.Reindex);
        SearchPermissions.All.Should().HaveCount(3);
    }
}

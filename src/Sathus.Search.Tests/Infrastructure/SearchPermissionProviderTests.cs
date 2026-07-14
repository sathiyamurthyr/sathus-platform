namespace Sathus.Search.Tests.Infrastructure;

public class SearchPermissionProviderTests
{
    [Fact]
    public async Task GetFiltersForUserAsync_Should_Return_User_And_Role_Filters()
    {
        var config = new ConfigurationBuilder().Build();
        var provider = new SearchPermissionProvider(Mock.Of<ILogger<SearchPermissionProvider>>());

        var filters = await provider.GetFiltersForUserAsync("user-1", "admin,editor", CancellationToken.None);

        filters.Should().HaveCount(2);
        filters.Should().Contain(f => f.Field == "allowed_users" && f.Value == "user-1" && f.Operator == "IN");
        filters.Should().Contain(f => f.Field == "required_roles" && f.Value == "admin,editor" && f.Operator == "IN");
    }

    [Fact]
    public async Task GetFiltersForUserAsync_Should_Return_Empty_When_No_User()
    {
        var provider = new SearchPermissionProvider(Mock.Of<ILogger<SearchPermissionProvider>>());

        var filters = await provider.GetFiltersForUserAsync("", "admin", CancellationToken.None);

        filters.Should().HaveCount(1);
        filters.Should().Contain(f => f.Field == "required_roles");
    }
}

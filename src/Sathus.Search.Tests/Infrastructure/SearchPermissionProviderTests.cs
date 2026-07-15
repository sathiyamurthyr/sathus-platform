global using FluentAssertions;
global using Xunit;
global using Microsoft.Extensions.Logging;
global using Moq;
global using Sathus.Search.Application.Interfaces;
global using Sathus.Search.Domain.Entities;
global using Sathus.Search.Domain.Enums;
global using Sathus.Search.Domain.ValueObjects;
global using Sathus.Search.Infrastructure.Services;

namespace Sathus.Search.Tests.Infrastructure;

public class SearchPermissionProviderTests
{
    [Fact]
    public async Task GetFiltersForUserAsync_Should_Return_User_And_Role_Filters()
    {
        var provider = new SearchPermissionProvider(Mock.Of<ILogger<SearchPermissionProvider>>());

        var filters = await provider.GetFiltersForUserAsync("user-1", "admin,editor", CancellationToken.None);

        filters.Should().HaveCount(2);
        filters.Should().Contain(f => f.Field == "allowed_users" && (string)f.Value == "user-1" && f.Operator == FilterOperator.In);
        filters.Should().Contain(f => f.Field == "required_roles" && (string)f.Value == "admin,editor" && f.Operator == FilterOperator.In);
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

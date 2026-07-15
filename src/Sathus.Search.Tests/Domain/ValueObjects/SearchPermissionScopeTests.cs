global using FluentAssertions;
global using Xunit;
global using Sathus.Search.Domain.Enums;
global using Sathus.Search.Domain.ValueObjects;

namespace Sathus.Search.Tests.Domain.ValueObjects;

public class SearchPermissionScopeTests
{
    [Fact]
    public void Create_Should_Set_Properties()
    {
        var scope = SearchPermissionScope.Create(PermissionScope.Public);

        scope.Scope.Should().Be(PermissionScope.Public);
        scope.RequiredRoles.Should().BeNull();
        scope.AllowedUsers.Should().BeNull();
    }

    [Fact]
    public void Create_Should_Set_Optional_Properties()
    {
        var scope = SearchPermissionScope.Create(PermissionScope.RoleBased, "admin,editor", "user-1");

        scope.Scope.Should().Be(PermissionScope.RoleBased);
        scope.RequiredRoles.Should().Be("admin,editor");
        scope.AllowedUsers.Should().Be("user-1");
    }

    [Fact]
    public void IsVisibleTo_Should_Return_True_For_Public()
    {
        var scope = SearchPermissionScope.Create(PermissionScope.Public);

        var result = scope.IsVisibleTo(null, null);

        result.Should().BeTrue();
    }

    [Fact]
    public void IsVisibleTo_Should_Return_False_For_Authenticated_When_No_User()
    {
        var scope = SearchPermissionScope.Create(PermissionScope.Authenticated);

        var result = scope.IsVisibleTo(null, null);

        result.Should().BeFalse();
    }

    [Fact]
    public void IsVisibleTo_Should_Return_True_For_Authenticated_When_User_Provided()
    {
        var scope = SearchPermissionScope.Create(PermissionScope.Authenticated);

        var result = scope.IsVisibleTo("user-1", null);

        result.Should().BeTrue();
    }

    [Fact]
    public void IsVisibleTo_Should_Return_True_For_RoleBased_When_Roles_Match()
    {
        var scope = SearchPermissionScope.Create(PermissionScope.RoleBased, "admin,editor");

        var result = scope.IsVisibleTo("user-1", new[] { "admin", "viewer" });

        result.Should().BeTrue();
    }

    [Fact]
    public void IsVisibleTo_Should_Return_False_For_RoleBased_When_Roles_Do_Not_Match()
    {
        var scope = SearchPermissionScope.Create(PermissionScope.RoleBased, "admin,editor");

        var result = scope.IsVisibleTo("user-1", new[] { "viewer" });

        result.Should().BeFalse();
    }

    [Fact]
    public void IsVisibleTo_Should_Be_Case_Insensitive_For_Roles()
    {
        var scope = SearchPermissionScope.Create(PermissionScope.RoleBased, "ADMIN");

        var result = scope.IsVisibleTo("user-1", new[] { "admin" });

        result.Should().BeTrue();
    }

    [Fact]
    public void IsVisibleTo_Should_Return_True_For_Private_When_User_In_AllowedUsers()
    {
        var scope = SearchPermissionScope.Create(PermissionScope.Private, null, "user-1,user-2");

        var result = scope.IsVisibleTo("user-1", null);

        result.Should().BeTrue();
    }

    [Fact]
    public void IsVisibleTo_Should_Return_False_For_Private_When_User_Not_In_AllowedUsers()
    {
        var scope = SearchPermissionScope.Create(PermissionScope.Private, null, "user-1,user-2");

        var result = scope.IsVisibleTo("user-3", null);

        result.Should().BeFalse();
    }

    [Fact]
    public void IsVisibleTo_Should_Be_Case_Insensitive_For_Private_AllowedUsers()
    {
        var scope = SearchPermissionScope.Create(PermissionScope.Private, null, "USER-1");

        var result = scope.IsVisibleTo("user-1", null);

        result.Should().BeTrue();
    }
}

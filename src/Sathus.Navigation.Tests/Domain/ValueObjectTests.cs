using FluentAssertions;
using Sathus.Navigation.Domain.ValueObjects;

namespace Sathus.Navigation.Tests.Domain;

public class ValueObjectTests
{
    [Fact]
    public void TreeId_New_Should_Not_Be_Empty()
    {
        var id = TreeId.New();
        id.Value.Should().NotBe(Guid.Empty);
    }

    [Fact]
    public void TreeId_From_Empty_Should_Throw()
    {
        var act = () => TreeId.From(Guid.Empty);
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void RoutePath_Internal_Should_Normalize()
    {
        var route = RoutePath.Create("Products/WIDGET");
        route.Value.Should().Be("/products/widget");
        route.IsExternal.Should().BeFalse();
    }

    [Fact]
    public void RoutePath_External_Should_Preserve()
    {
        var route = RoutePath.External("https://example.com");
        route.IsExternal.Should().BeTrue();
        route.Value.Should().Be("https://example.com");
    }

    [Fact]
    public void RoutePath_Mailto_Is_External()
    {
        var route = RoutePath.Create("mailto:hello@sathus.com");
        route.IsExternal.Should().BeTrue();
    }

    [Fact]
    public void MenuType_WellKnown_Types_Are_Detected()
    {
        foreach (MenuType type in MenuType.WellKnown)
        {
            type.IsWellKnown.Should().BeTrue();
        }
    }

    [Fact]
    public void MenuType_Custom_Type_Should_Be_Creatable()
    {
        var type = MenuType.Create("enterprise-portal");
        type.Value.Should().Be("enterprise-portal");
        type.IsWellKnown.Should().BeFalse();
    }

    [Fact]
    public void SortOrder_Negative_Should_Throw()
    {
        var act = () => SortOrder.Create(-1);
        act.Should().Throw<ArgumentOutOfRangeException>();
    }

    [Fact]
    public void NavigationDepth_Root_Should_Be_Zero()
    {
        NavigationDepth.Root.Value.Should().Be(0);
    }

    [Fact]
    public void NavigationDepth_Next_Should_Increment()
    {
        var depth = NavigationDepth.Root.Next();
        depth.Value.Should().Be(1);
    }

    [Fact]
    public void DisplayName_Empty_Should_Throw()
    {
        var act = () => DisplayName.Create(string.Empty);
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void VisibilityRule_Public_Is_Convenience_Factory()
    {
        var rule = VisibilityRule.Public();
        rule.RuleType.Should().Be(VisibilityRuleType.Public);
        rule.Effect.Should().Be(VisibilityEffect.Show);
    }

    [Fact]
    public void VisibilityRule_Permission_Requires_Value()
    {
        var act = () => VisibilityRule.Create(VisibilityRuleType.Permission, string.Empty);
        act.Should().Throw<ArgumentException>();
    }
}

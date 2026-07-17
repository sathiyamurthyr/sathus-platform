using FluentAssertions;
using Sathus.Navigation.Domain.Entities;
using Sathus.Navigation.Domain.Enums;
using Sathus.Navigation.Domain.Events;
using Sathus.Navigation.Domain.Exceptions;
using Sathus.Navigation.Domain.ValueObjects;

namespace Sathus.Navigation.Tests.Domain;

public class NavigationTreeTests
{
    [Fact]
    public void Create_Should_Return_Tree_With_Defaults()
    {
        var tree = NavigationTree.Create(Platform.Website, "Main", "en", "description", Guid.NewGuid());

        tree.Should().NotBeNull();
        tree.Name.Should().Be("Main");
        tree.Platform.Should().Be(Platform.Website);
        tree.DefaultLocale.Should().Be("en");
        tree.Status.Should().Be(MenuStatus.Draft);
        tree.DomainEvents.Should().ContainSingle().Which.Should().BeOfType<NavigationTreeCreatedEvent>();
    }

    [Fact]
    public void AddMenu_Should_Add_Menu_And_Raise_Event()
    {
        var tree = NavigationTree.Create(Platform.Website, "Main", "en");
        tree.ClearDomainEvents();

        var menu = tree.AddMenu("Main Nav", MenuType.Main, "en", Guid.NewGuid());

        menu.Should().NotBeNull();
        menu.Name.Should().Be("Main Nav");
        menu.Type.Should().Be(MenuType.Main);
        tree.DomainEvents.Should().ContainSingle().Which.Should().BeOfType<NavigationMenuCreatedEvent>();
    }

    [Fact]
    public void Archive_Should_Set_Status_To_Archived()
    {
        var tree = NavigationTree.Create(Platform.Website, "Main", "en");

        tree.Archive(Guid.NewGuid());

        tree.Status.Should().Be(MenuStatus.Archived);
    }
}

public class NavigationMenuTests
{
    [Fact]
    public void CreateNode_Should_Create_Root_Node_At_Depth_Zero()
    {
        var menu = NavigationMenu.Create(Guid.NewGuid(), "Main", MenuType.Main, "en");

        var node = menu.CreateNode(null, "Home", ItemType.Link, "/home");

        node.Should().NotBeNull();
        node.Depth.Should().Be(0);
        node.SortOrder.Should().Be(0);
        node.DisplayName.Should().Be("Home");
        menu.Nodes.Should().ContainSingle();
    }

    [Fact]
    public void CreateNode_With_Parent_Should_Increment_Depth()
    {
        var menu = NavigationMenu.Create(Guid.NewGuid(), "Main", MenuType.Main, "en");
        var root = menu.CreateNode(null, "Products", ItemType.Link, "/products");

        var child = menu.CreateNode(root.Id, "Widget", ItemType.Link, "/products/widget");

        child.Depth.Should().Be(1);
        root.Children.Should().ContainSingle();
    }

    [Fact]
    public void MoveNode_Under_Itself_Should_Throw()
    {
        var menu = NavigationMenu.Create(Guid.NewGuid(), "Main", MenuType.Main, "en");
        var node = menu.CreateNode(null, "Home", ItemType.Link, "/home");

        var act = () => menu.MoveNode(node.Id, node.Id, 0);

        act.Should().Throw<NavigationCircularReferenceException>();
    }

    [Fact]
    public void CopyNode_Should_Clone_Subtree()
    {
        var menu = NavigationMenu.Create(Guid.NewGuid(), "Main", MenuType.Main, "en");
        var root = menu.CreateNode(null, "Root", ItemType.Link, "/root");
        menu.CreateNode(root.Id, "Child", ItemType.Link, "/root/child");

        var copyId = menu.CopyNode(root.Id, null);

        menu.Nodes.Should().HaveCount(2);
        var copy = menu.FindNode(copyId);
        copy.Should().NotBeNull();
        copy!.Children.Should().HaveCount(1);
    }

    [Fact]
    public void CreateVersion_Should_Increment_Counter()
    {
        var menu = NavigationMenu.Create(Guid.NewGuid(), "Main", MenuType.Main, "en");
        menu.CreateNode(null, "A", ItemType.Link, "/a");

        var v1 = menu.CreateVersion("v1", Guid.NewGuid());
        var v2 = menu.CreateVersion("v2", Guid.NewGuid());

        v1.VersionNumber.Should().Be(1);
        v2.VersionNumber.Should().Be(2);
        menu.VersionCounter.Should().Be(2);
    }

    [Fact]
    public void Publish_Should_Set_Status_And_Items()
    {
        var menu = NavigationMenu.Create(Guid.NewGuid(), "Main", MenuType.Main, "en");
        menu.CreateNode(null, "A", ItemType.Link, "/a");
        var version = menu.CreateVersion("v1", Guid.NewGuid());

        menu.Publish(version.Id, Guid.NewGuid());

        menu.Status.Should().Be(MenuStatus.Published);
        menu.PublishedVersionId.Should().NotBeNull();
        menu.Items.Should().NotBeEmpty();
        menu.DomainEvents.Should().Contain(n => n is NavigationMenuPublishedEvent);
    }

    [Fact]
    public void Rollback_Restores_Snapshot()
    {
        var menu = NavigationMenu.Create(Guid.NewGuid(), "Main", MenuType.Main, "en");
        menu.CreateNode(null, "A", ItemType.Link, "/a");
        var v1 = menu.CreateVersion("v1", Guid.NewGuid());
        menu.Publish(v1.Id, Guid.NewGuid());

        menu.CreateNode(null, "B", ItemType.Link, "/b");
        var v2 = menu.CreateVersion("v2", Guid.NewGuid());

        var rolled = menu.Rollback(v2.Id, Guid.NewGuid());

        rolled.Should().NotBeNull();
        menu.Status.Should().Be(MenuStatus.Published);
    }
}

public class NavigationMenuVersionTests
{
    [Fact]
    public void SchedulePublish_Requires_Future_Date()
    {
        var menu = NavigationMenu.Create(Guid.NewGuid(), "Main", MenuType.Main, "en");
        menu.CreateNode(null, "A", ItemType.Link, "/a");
        var version = menu.CreateVersion("v1", Guid.NewGuid());

        var act = () => menu.SchedulePublish(version.Id, DateTime.UtcNow.AddMinutes(-1), Guid.NewGuid());

        act.Should().Throw<NavigationInvalidOperationException>();
    }

    [Fact]
    public void CreateVersion_Empty_Menu_Should_Produce_Empty_Items()
    {
        var menu = NavigationMenu.Create(Guid.NewGuid(), "Main", MenuType.Main, "en");
        var version = menu.CreateVersion("v1", Guid.NewGuid());

        menu.RegenerateItems(version).Should().BeEmpty();
    }
}

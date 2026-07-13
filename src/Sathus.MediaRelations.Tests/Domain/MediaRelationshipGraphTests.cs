namespace Sathus.MediaRelations.Tests.Domain;

public class MediaRelationshipGraphTests
{
    [Fact]
    public void NewGraph_HasRootAssetNode()
    {
        var assetId = Guid.NewGuid();
        var graph = new MediaRelationshipGraph(assetId);

        graph.RootAssetId.Should().Be(assetId);
        graph.Nodes.Should().ContainSingle();
        graph.Nodes.Single().NodeKey.Should().Be(graph.RootNodeKey);
        graph.MaxDepth.Should().Be(0);
    }

    [Fact]
    public void AddNode_IsIdempotentAndTracksMaxDepth()
    {
        var graph = new MediaRelationshipGraph(Guid.NewGuid());
        graph.AddNode("page:home", GraphNodeType.Content, 1);
        graph.AddNode("page:home", GraphNodeType.Content, 1);
        graph.AddNode("nav:main", GraphNodeType.Content, 2);

        graph.Nodes.Should().HaveCount(3);
        graph.MaxDepth.Should().Be(2);
    }

    [Fact]
    public void AddEdge_IsIdempotent()
    {
        var graph = new MediaRelationshipGraph(Guid.NewGuid());
        graph.AddEdge("a", "b", "featured-image");
        graph.AddEdge("a", "b", "featured-image");
        graph.Edges.Should().ContainSingle();
    }

    [Fact]
    public void GetDependents_ExcludesRoot_OrdersByDepth()
    {
        var graph = new MediaRelationshipGraph(Guid.NewGuid());
        graph.AddNode("nav:main", GraphNodeType.Content, 2);
        graph.AddNode("page:home", GraphNodeType.Content, 1);

        var dependents = graph.GetDependents();
        dependents.Should().HaveCount(2);
        dependents[0].Depth.Should().Be(1);
        dependents[1].Depth.Should().Be(2);
    }

    [Fact]
    public void GetDirectDependents_ReturnsDepthOne()
    {
        var graph = new MediaRelationshipGraph(Guid.NewGuid());
        graph.AddNode("page:home", GraphNodeType.Content, 1);
        graph.AddNode("nav:main", GraphNodeType.Content, 2);

        graph.GetDirectDependents().Should().ContainSingle(n => n.NodeKey == "page:home");
    }

    [Fact]
    public void DetectCycle_NoCycle_ReturnsFalse()
    {
        var graph = new MediaRelationshipGraph(Guid.NewGuid());
        var root = graph.RootNodeKey;
        graph.AddNode("page:home", GraphNodeType.Content, 1);
        graph.AddNode("nav:main", GraphNodeType.Content, 2);
        graph.AddEdge(root, "page:home", "featured-image");
        graph.AddEdge("page:home", "nav:main", "inline-content");

        graph.DetectCycle().Should().BeFalse();
        graph.HasCycle.Should().BeFalse();
    }

    [Fact]
    public void DetectCycle_WithCycle_ReturnsTrue()
    {
        var graph = new MediaRelationshipGraph(Guid.NewGuid());
        graph.AddNode("a", GraphNodeType.Content, 1);
        graph.AddNode("b", GraphNodeType.Content, 2);
        graph.AddNode("c", GraphNodeType.Content, 3);
        graph.AddEdge("a", "b", "r");
        graph.AddEdge("b", "c", "r");
        graph.AddEdge("c", "a", "r");

        graph.DetectCycle().Should().BeTrue();
        graph.HasCycle.Should().BeTrue();
    }

    [Fact]
    public void NewGraph_EmptyAsset_Throws()
    {
        Action act = () => new MediaRelationshipGraph(Guid.Empty);
        act.Should().Throw<ArgumentException>();
    }
}

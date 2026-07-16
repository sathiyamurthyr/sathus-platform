using MediatR;
using Sathus.MediaRelations.Application.Commands.CreateReference;
using Sathus.MediaRelations.Application.Commands.RecordInteraction;
using Sathus.MediaRelations.Application.Queries.EvaluateSafeDelete;
using Sathus.MediaRelations.Application.Queries.GetAssetRelations;
using Sathus.MediaRelations.Domain.Entities;
using Sathus.MediaRelations.Domain.Enums;
using Sathus.MediaRelations.Domain.ValueObjects;

namespace Sathus.MediaRelations.Tests.Infrastructure;

public class RepositoryAndQueryTests
{
    [Fact]
    public async Task MediaDependency_PersistsOwnedLevel()
    {
        using var f = new EngineFixture();
        var dependency = new MediaDependency(Guid.NewGuid(), "page:home", GraphNodeType.Content,
            DependencyLevel.Create(2), "asset:x -> page:home");
        await f.Dependencies.AddAsync(dependency);
        await f.Dependencies.SaveChangesAsync();

        var reloaded = (await f.Dependencies.GetByAssetIdAsync(dependency.AssetId)).Single();
        reloaded.Level.Value.Should().Be(2);
        reloaded.DependentNodeKey.Should().Be("page:home");
    }

    [Fact]
    public async Task MediaReferenceSnapshot_PersistsAndReads()
    {
        using var f = new EngineFixture();
        var snapshot = new MediaReferenceSnapshot(Guid.NewGuid(), 3, "{}", "initial");
        await f.Snapshots.AddAsync(snapshot);
        await f.Snapshots.SaveChangesAsync();

        var reloaded = await f.Snapshots.GetLatestAsync(snapshot.AssetId);
        reloaded.Should().NotBeNull();
        reloaded!.ReferenceCount.Should().Be(3);
        reloaded.Reason.Should().Be("initial");
        reloaded.ContentHash.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task RelationshipGraphRepository_RoundTripsNodesAndEdges()
    {
        using var f = new EngineFixture();
        var graph = new MediaRelationshipGraph(Guid.NewGuid());
        graph.AddNode("page:home", GraphNodeType.Content, 1, "page:home");
        graph.AddEdge(graph.RootNodeKey, "page:home", "featured-image");
        await f.Graphs.AddAsync(graph);
        await f.Graphs.SaveChangesAsync();

        var reloaded = await f.Graphs.GetByAssetIdAsync(graph.RootAssetId);
        reloaded.Should().NotBeNull();
        reloaded!.Nodes.Should().HaveCount(2);
        reloaded.Edges.Should().ContainSingle();
    }

    [Fact]
    public async Task UsageStatistics_SyncReferenceCount_Reconciles()
    {
        using var f = new EngineFixture();
        var stats = new MediaUsageStatistics(Guid.NewGuid());
        stats.RecordReferenceAdded();
        stats.RecordReferenceAdded();
        await f.Statistics.AddAsync(stats);
        await f.Statistics.SaveChangesAsync();

        stats.SyncReferenceCount(0);
        await f.Statistics.UpdateAsync(stats);
        await f.Statistics.SaveChangesAsync();

        var reloaded = await f.Statistics.GetByAssetIdAsync(stats.AssetId);
        reloaded!.ReferenceCount.Should().Be(0);
        reloaded.IsUnused.Should().BeTrue();
    }

    [Fact]
    public async Task GetAssetRelations_ReturnsAuditEdges()
    {
        using var f = new EngineFixture();
        var assetId = Guid.NewGuid();
        await new CreateReferenceCommandHandler(f.References, f.Usages, f.Statistics, f.Relations, f.History, f.GraphCache)
            .Handle(new CreateReferenceCommand(assetId, "web", ReferenceType.PageValue, "home", UsageType.FeaturedImageValue),
                CancellationToken.None);

        var handler = new GetAssetRelationsQueryHandler(f.Relations);
        var relations = await handler.Handle(new GetAssetRelationsQuery(assetId), CancellationToken.None);

        relations.Should().ContainSingle(r => r.TargetNodeKey == "page:home");
    }

    [Fact]
    public async Task EvaluateSafeDelete_QueryUsesPolicy()
    {
        using var f = new EngineFixture();
        var assetId = Guid.NewGuid();
        await new CreateReferenceCommandHandler(f.References, f.Usages, f.Statistics, f.Relations, f.History, f.GraphCache)
            .Handle(new CreateReferenceCommand(assetId, "web", ReferenceType.PageValue, "home", UsageType.FeaturedImageValue,
                Scope: ReferenceScope.PublishedValue), CancellationToken.None);

        var handler = new EvaluateSafeDeleteQueryHandler(f.CreateSafeDeletePolicy());
        var result = await handler.Handle(new EvaluateSafeDeleteQuery(assetId), CancellationToken.None);

        result.CanDelete.Should().BeFalse();
        result.PublishedReferenceCount.Should().Be(1);
    }

    [Fact]
    public async Task RecordInteraction_ProducesUsageStatisticsEntry()
    {
        using var f = new EngineFixture();
        var reference = TestHelpers.NewReference(Guid.NewGuid());
        await f.References.AddAsync(reference);
        await f.References.SaveChangesAsync();

        var view = await new RecordAssetViewCommandHandler(f.Statistics)
            .Handle(new RecordAssetViewCommand(reference.AssetId, 5), CancellationToken.None);

        view.ViewCount.Should().Be(5);
    }
}

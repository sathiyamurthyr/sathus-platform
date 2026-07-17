using Sathus.MediaRelations.Application.Commands.CreateReference;
using Sathus.MediaRelations.Application.Commands.RecordInteraction;
using Sathus.MediaRelations.Application.Queries.GetAssetDependents;
using Sathus.MediaRelations.Application.Queries.GetAssetRelations;
using Sathus.MediaRelations.Application.Queries.GetAssetUsage;
using Sathus.MediaRelations.Application.Queries.GetBrokenReferences;
using Sathus.MediaRelations.Application.Queries.GetOrphans;
using Sathus.MediaRelations.Application.Queries.GetReferenceHistory;
using Sathus.MediaRelations.Application.Queries.GetUsageGraph;
using Sathus.MediaRelations.Application.Queries.SearchReferences;
using Sathus.MediaRelations.Domain.ValueObjects;

namespace Sathus.MediaRelations.Tests.Application;

public class QueryHandlerTests
{
    private static CreateReferenceCommandHandler CreateHandler(EngineFixture f) =>
        new(f.References, f.Usages, f.Statistics, f.Relations, f.History, f.GraphCache);

    private static async Task<Guid> SeedReferenceAsync(EngineFixture f, Guid? assetId = null, string source = "home", string usage = UsageType.FeaturedImageValue, string scope = "draft")
    {
        var id = assetId ?? Guid.NewGuid();
        await CreateHandler(f).Handle(
            new CreateReferenceCommand(id, "web", ReferenceType.PageValue, source, usage, Scope: scope),
            CancellationToken.None);
        return id;
    }

    [Fact]
    public async Task GetAssetUsage_ReturnsReferencesAndStatistics()
    {
        using var f = new EngineFixture();
        var assetId = await SeedReferenceAsync(f);

        var handler = new GetAssetUsageQueryHandler(f.References, f.Statistics);
        var result = await handler.Handle(new GetAssetUsageQuery(assetId), CancellationToken.None);

        result.ActiveReferenceCount.Should().Be(1);
        result.References.Should().ContainSingle();
        result.IsOrphan.Should().BeFalse();
    }

    [Fact]
    public async Task GetAssetRelations_ReturnsEdges()
    {
        using var f = new EngineFixture();
        var assetId = await SeedReferenceAsync(f);

        var handler = new GetAssetRelationsQueryHandler(f.Relations);
        var result = await handler.Handle(new GetAssetRelationsQuery(assetId), CancellationToken.None);

        result.Should().ContainSingle(r => r.TargetNodeKey == "page:home");
    }

    [Fact]
    public async Task GetBrokenReferences_ReturnsPagedBroken()
    {
        using var f = new EngineFixture();
        var reference = TestHelpers.NewReference();
        reference.MarkBroken("gone");
        await f.References.AddAsync(reference);
        await f.References.SaveChangesAsync();

        var handler = new GetBrokenReferencesQueryHandler(f.References);
        var result = await handler.Handle(new GetBrokenReferencesQuery(1, 10), CancellationToken.None);

        result.TotalCount.Should().Be(1);
        result.Items.Should().ContainSingle();
    }

    [Fact]
    public async Task GetOrphans_ReturnsUnusedAssets()
    {
        using var f = new EngineFixture();
        var stats = new MediaUsageStatistics(Guid.NewGuid());
        stats.RecordReferenceAdded();
        stats.RecordReferenceRemoved(); // now unused
        await f.Statistics.AddAsync(stats);
        await f.Statistics.SaveChangesAsync();

        var handler = new GetOrphanAssetsQueryHandler(f.Statistics);
        var result = await handler.Handle(new GetOrphanAssetsQuery(1, 10), CancellationToken.None);

        result.TotalCount.Should().Be(1);
    }

    [Fact]
    public async Task Search_FiltersByReferenceTypeAndUsageType()
    {
        using var f = new EngineFixture();
        await SeedReferenceAsync(f, source: "home", usage: UsageType.FeaturedImageValue);
        await SeedReferenceAsync(f, source: "about", usage: UsageType.GalleryValue);

        var handler = new SearchReferencesQueryHandler(f.References);
        var byUsage = await handler.Handle(new SearchReferencesQuery(UsageType: UsageType.GalleryValue), CancellationToken.None);

        byUsage.Items.Should().OnlyContain(r => r.UsageType == UsageType.GalleryValue);
        byUsage.TotalCount.Should().Be(1);
    }

    [Fact]
    public async Task Search_FiltersByModuleAndAsset()
    {
        using var f = new EngineFixture();
        var assetId = await SeedReferenceAsync(f);

        var handler = new SearchReferencesQueryHandler(f.References);
        var byAsset = await handler.Handle(new SearchReferencesQuery(AssetId: assetId, Module: "web"), CancellationToken.None);

        byAsset.TotalCount.Should().Be(1);
    }

    [Fact]
    public async Task GetReferenceHistory_ReturnsEntries()
    {
        using var f = new EngineFixture();
        var created = await CreateHandler(f).Handle(
            new CreateReferenceCommand(Guid.NewGuid(), "web", ReferenceType.PageValue, "home", UsageType.FeaturedImageValue),
            CancellationToken.None);

        var handler = new GetReferenceHistoryQueryHandler(f.History);
        var history = await handler.Handle(new GetReferenceHistoryQuery(created.Id), CancellationToken.None);

        history.Should().Contain(h => h.Action == nameof(ReferenceHistoryAction.Created));
    }

    [Fact]
    public async Task RecordViewAndDownload_UpdateStatistics()
    {
        using var f = new EngineFixture();
        var assetId = Guid.NewGuid();

        var viewHandler = new RecordAssetViewCommandHandler(f.Statistics);
        await viewHandler.Handle(new RecordAssetViewCommand(assetId, 3), CancellationToken.None);

        var downloadHandler = new RecordAssetDownloadCommandHandler(f.Statistics);
        var stats = await downloadHandler.Handle(new RecordAssetDownloadCommand(assetId, 2), CancellationToken.None);

        stats.ViewCount.Should().Be(3);
        stats.DownloadCount.Should().Be(2);
    }

    [Fact]
    public async Task GetAssetDependents_ReturnsRecursiveChain()
    {
        using var f = new EngineFixture();
        var assetId = Guid.NewGuid();
        await SeedReferenceAsync(f, assetId);

        // content -> landing page edge (content referenced by landing page).
        var edge = new MediaRelation("page:home", GraphNodeType.Content, "page:landing", GraphNodeType.Content, "inline-content");
        await f.Relations.AddAsync(edge);
        await f.Relations.SaveChangesAsync();

        var handler = new GetAssetDependentsQueryHandler(f.GraphBuilder);
        var dependents = await handler.Handle(new GetAssetDependentsQuery(assetId), CancellationToken.None);

        dependents.Should().Contain(d => d.NodeKey == "page:home" && d.IsDirect);
        dependents.Should().Contain(d => d.NodeKey == "page:landing" && d.Level == 2);
    }

    [Fact]
    public async Task GetUsageGraph_ReturnsNodesAndEdges()
    {
        using var f = new EngineFixture();
        var assetId = Guid.NewGuid();
        await SeedReferenceAsync(f, assetId);

        var handler = new GetUsageGraphQueryHandler(f.GraphBuilder);
        var graph = await handler.Handle(new GetUsageGraphQuery(assetId), CancellationToken.None);

        graph.RootAssetId.Should().Be(assetId);
        graph.Nodes.Should().Contain(n => n.NodeKey == "page:home");
        graph.Edges.Should().ContainSingle();
    }
}

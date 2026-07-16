using Microsoft.Extensions.Logging.Abstractions;
using Sathus.MediaRelations.Application.DTOs;
using Sathus.MediaRelations.Application.Commands.CreateReference;
using Sathus.MediaRelations.Domain.Entities;
using Sathus.MediaRelations.Domain.Enums;
using Sathus.MediaRelations.Domain.ValueObjects;
using Sathus.MediaRelations.Infrastructure.Services;

namespace Sathus.MediaRelations.Tests.Infrastructure;

public class EngineServiceTests
{
    private static async Task<(EngineFixture Fixture, Guid AssetId)> SeedReferenceAsync(Guid? assetId = null)
    {
        var f = new EngineFixture();
        var id = assetId ?? Guid.NewGuid();
        await new CreateReferenceCommandHandler(f.References, f.Usages, f.Statistics, f.Relations, f.History, f.GraphCache)
            .Handle(new CreateReferenceCommand(id, "web", ReferenceType.PageValue, "home", UsageType.FeaturedImageValue),
                CancellationToken.None);
        return (f, id);
    }

    [Fact]
    public async Task UsageGraphBuilder_WalksEdges_ToDependents()
    {
        var (f, asset) = await SeedReferenceAsync();

        var edge = new MediaRelation(MediaRelation.AssetNode(asset), GraphNodeType.Asset,
            "page:home", GraphNodeType.Content, "featured-image");
        var edge2 = new MediaRelation("page:home", GraphNodeType.Content,
            "nav:main", GraphNodeType.Content, "inline-content");
        await f.Relations.AddAsync(edge);
        await f.Relations.AddAsync(edge2);
        await f.Relations.SaveChangesAsync();

        var graph = await f.GraphBuilder.BuildAsync(asset);

        graph.GetDependents().Should().Contain(n => n.NodeKey == "page:home" && n.Depth == 1);
        graph.GetDependents().Should().Contain(n => n.NodeKey == "nav:main" && n.Depth == 2);
        graph.Edges.Should().HaveCount(2);
    }

    [Fact]
    public void UsageGraphBuilder_DetectsCycle()
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
    public void UsageGraphBuilder_NoCycle_ReturnsFalse()
    {
        var graph = new MediaRelationshipGraph(Guid.NewGuid());
        graph.AddEdge("a", "b", "r");
        graph.AddEdge("b", "c", "r");

        graph.DetectCycle().Should().BeFalse();
    }

    [Fact]
    public async Task SafeDeletePolicy_BlocksWhenActiveReferencesExist()
    {
        var f = new EngineFixture();
        var id = Guid.NewGuid();
        await new CreateReferenceCommandHandler(f.References, f.Usages, f.Statistics, f.Relations, f.History, f.GraphCache)
            .Handle(new CreateReferenceCommand(id, "web", ReferenceType.PageValue, "home", UsageType.FeaturedImageValue,
                Scope: ReferenceScope.PublishedValue), CancellationToken.None);

        var policy = f.CreateSafeDeletePolicy();
        var evaluation = await policy.EvaluateAsync(id);

        evaluation.CanDelete.Should().BeFalse();
        evaluation.ActiveReferenceCount.Should().Be(1);
        evaluation.BlockingReferenceCount.Should().Be(1);
    }

    [Fact]
    public async Task SafeDeletePolicy_ForceDelete_Allows()
    {
        var (f, asset) = await SeedReferenceAsync();

        var policy = f.CreateSafeDeletePolicy();
        var evaluation = await policy.EvaluateAsync(asset, forceDelete: true);

        evaluation.CanDelete.Should().BeTrue();
        evaluation.ForceApplied.Should().BeTrue();
    }

    [Fact]
    public async Task SafeDeletePolicy_NoReferences_Allows()
    {
        using var f = new EngineFixture();
        var asset = Guid.NewGuid();

        var policy = f.CreateSafeDeletePolicy();
        var evaluation = await policy.EvaluateAsync(asset);

        evaluation.CanDelete.Should().BeTrue();
        evaluation.ActiveReferenceCount.Should().Be(0);
    }

    [Fact]
    public async Task ReferenceScanner_ReportsMissingAndRepairsBroken()
    {
        using var f = new EngineFixture();
        var assetId = Guid.NewGuid();
        var reference = TestHelpers.NewReference(assetId); // not added to checker -> missing
        await f.References.AddAsync(reference);
        await f.References.SaveChangesAsync();

        var scanner = f.CreateScanner();
        var report = await scanner.ScanAsync(ReferenceScanOptions.Default, CancellationToken.None);

        report.IssueCountsByType.Should().ContainKey(ScannerIssueType.MissingAsset);
        report.IssueCountsByType.Should().ContainKey(ScannerIssueType.BrokenReference);
        report.BrokenRepaired.Should().Be(1);

        var reloaded = await f.References.GetByAssetIdAsync(assetId, includeInactive: true);
        reloaded.Single().Status.Should().Be(ReferenceStatus.Broken);

        var history = await f.History.GetByAssetIdAsync(assetId);
        history.Should().Contain(h => h.Action == ReferenceHistoryAction.Broken);
    }

    [Fact]
    public async Task ReferenceScanner_DetectsDuplicates()
    {
        using var f = new EngineFixture();
        var assetId = Guid.NewGuid();
        f.AssetChecker.Add(assetId);
        var r1 = TestHelpers.NewReference(assetId);
        var r2 = TestHelpers.NewReference(assetId);
        await f.References.AddAsync(r1);
        await f.References.AddAsync(r2);
        await f.References.SaveChangesAsync();

        var scanner = f.CreateScanner();
        var report = await scanner.ScanAsync(new ReferenceScanOptions(
            DetectBroken: false, DetectMissingAssets: false, DetectCircular: false, DetectOrphans: false, DetectUnused: false),
            CancellationToken.None);

        report.IssueCountsByType.Should().ContainKey(ScannerIssueType.DuplicateReference);
        report.IssueCountsByType[ScannerIssueType.DuplicateReference].Should().BeGreaterThanOrEqualTo(1);
    }

    [Fact]
    public async Task ReferenceScanner_CleanAsset_HasNoIssues()
    {
        using var f = new EngineFixture();
        var assetId = Guid.NewGuid();
        f.AssetChecker.Add(assetId);
        await new CreateReferenceCommandHandler(f.References, f.Usages, f.Statistics, f.Relations, f.History, f.GraphCache)
            .Handle(new CreateReferenceCommand(assetId, "web", ReferenceType.PageValue, "home", UsageType.FeaturedImageValue),
                CancellationToken.None);

        var scanner = f.CreateScanner();
        var report = await scanner.ScanAsync(ReferenceScanOptions.Default, CancellationToken.None);

        report.IssueCountsByType.Should().NotContainKey(ScannerIssueType.MissingAsset);
        report.IssueCountsByType.Should().NotContainKey(ScannerIssueType.BrokenReference);
        report.BrokenRepaired.Should().Be(0);
    }
}

using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Sathus.Media.Infrastructure.Persistence;
using Sathus.MediaRelations.Application.Interfaces;
using Sathus.MediaRelations.Infrastructure.Configuration;
using Sathus.MediaRelations.Infrastructure.Extensions;
using Sathus.MediaRelations.Infrastructure.HostedServices;
using Sathus.MediaRelations.Infrastructure.Observability;

namespace Sathus.MediaRelations.Tests.Infrastructure;

/// <summary>
/// Coverage for infrastructure services (clock, cache, metrics, existence checker),
/// configuration/DI wiring, the background scanner and the remaining repository queries.
/// </summary>
public class ServicesAndReposCoverageTests
{
    [Fact]
    public void SystemClock_ReturnsCurrentUtc()
    {
        var clock = new SystemClock();
        clock.UtcNow.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
    }

    [Fact]
    public async Task InMemoryUsageGraphCache_SetGetInvalidate()
    {
        using var memory = new MemoryCache(new MemoryCacheOptions { SizeLimit = 10_000 });
        var cache = new InMemoryUsageGraphCache(memory);
        var assetId = Guid.NewGuid();
        var graph = new MediaRelationshipGraph(assetId);
        graph.AddNode("page:home", GraphNodeType.Content, 1, "page:home");
        graph.AddEdge(graph.RootNodeKey, "page:home", "featured-image");

        (await cache.GetAsync(assetId)).Should().BeNull();

        await cache.SetAsync(graph);
        var fetched = await cache.GetAsync(assetId);
        fetched.Should().NotBeNull();
        fetched!.RootAssetId.Should().Be(assetId);

        await cache.InvalidateAsync(assetId);
        (await cache.GetAsync(assetId)).Should().BeNull();
    }

    [Fact]
    public async Task MediaAssetExistenceChecker_ResolvesAgainstMediaContext()
    {
        var options = new DbContextOptionsBuilder<MediaDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        using var mediaContext = new MediaDbContext(options);
        var checker = new MediaAssetExistenceChecker(mediaContext);

        (await checker.ExistsAsync(Guid.NewGuid())).Should().BeFalse();
        (await checker.ExistingAsync(Array.Empty<Guid>())).Should().BeEmpty();
        (await checker.ExistingAsync(new[] { Guid.NewGuid(), Guid.NewGuid() })).Should().BeEmpty();
    }

    [Fact]
    public void MediaRelationsMetrics_ExposeInstruments()
    {
        using var metrics = new MediaRelationsMetrics();
        metrics.ReferencesCreated.Add(1);
        metrics.ReferencesRemoved.Add(1);
        metrics.ReferencesBroken.Add(1);
        metrics.ReferencesRestored.Add(1);
        metrics.ScansCompleted.Add(1);
        metrics.ScanIssuesFound.Add(2);
        metrics.GraphBuildDurationMs.Record(12.5);
        MediaRelationsMetrics.MeterName.Should().Be("Sathus.MediaRelations");
    }

    [Fact]
    public void ReferenceScannerOptions_HasSafeDefaults()
    {
        var options = new ReferenceScannerOptions();
        options.Enabled.Should().BeFalse();
        options.Interval.Should().Be(TimeSpan.FromHours(6));
        options.InitialDelay.Should().Be(TimeSpan.FromMinutes(1));
        options.BatchSize.Should().Be(500);
        options.AutoRepair.Should().BeTrue();
        ReferenceScannerOptions.SectionName.Should().Be("MediaRelations:Scanner");
    }

    [Fact]
    public async Task BackgroundScanner_Disabled_DoesNotScan()
    {
        var scanner = new Mock<IReferenceScanner>();
        using var provider = new ServiceCollection()
            .AddScoped(_ => scanner.Object)
            .BuildServiceProvider();

        using var service = new ReferenceScannerBackgroundService(
            provider.GetRequiredService<IServiceScopeFactory>(),
            Options.Create(new ReferenceScannerOptions { Enabled = false }),
            new MediaRelationsMetrics(),
            NullLogger<ReferenceScannerBackgroundService>.Instance);

        await service.StartAsync(CancellationToken.None);
        await service.StopAsync(CancellationToken.None);

        scanner.Verify(s => s.ScanAsync(It.IsAny<ReferenceScanOptions>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task BackgroundScanner_Enabled_RunsScanAndRecordsMetrics()
    {
        var completed = new TaskCompletionSource();
        var report = new ReferenceScanReport(DateTime.UtcNow, DateTime.UtcNow, 5, 2, 1,
            new[] { new ReferenceScanIssue(ScannerIssueType.BrokenReference, Guid.NewGuid(), Guid.NewGuid(), "broken") });

        var scanner = new Mock<IReferenceScanner>();
        scanner
            .Setup(s => s.ScanAsync(It.IsAny<ReferenceScanOptions>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(report)
            .Callback(() => completed.TrySetResult());

        using var provider = new ServiceCollection()
            .AddScoped(_ => scanner.Object)
            .BuildServiceProvider();

        using var metrics = new MediaRelationsMetrics();
        using var service = new ReferenceScannerBackgroundService(
            provider.GetRequiredService<IServiceScopeFactory>(),
            Options.Create(new ReferenceScannerOptions
            {
                Enabled = true,
                InitialDelay = TimeSpan.Zero,
                Interval = TimeSpan.FromHours(1)
            }),
            metrics,
            NullLogger<ReferenceScannerBackgroundService>.Instance);

        await service.StartAsync(CancellationToken.None);
        var finished = await Task.WhenAny(completed.Task, Task.Delay(TimeSpan.FromSeconds(5)));
        await service.StopAsync(CancellationToken.None);

        finished.Should().Be(completed.Task, "the enabled scanner should execute at least one scan");
        scanner.Verify(s => s.ScanAsync(It.IsAny<ReferenceScanOptions>(), It.IsAny<CancellationToken>()), Times.AtLeastOnce);
    }

    [Fact]
    public void AddMediaRelationsInfrastructure_RegistersEngineServices()
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:DefaultConnection"] = "Host=localhost;Database=test;Username=u;Password=p"
            })
            .Build();

        var services = new ServiceCollection();
        services.AddLogging();
        services.AddMediaRelationsInfrastructure(configuration);

        services.Should().Contain(d => d.ServiceType == typeof(IClock));
        services.Should().Contain(d => d.ServiceType == typeof(IUsageGraphCache));
        services.Should().Contain(d => d.ServiceType == typeof(IReferenceScanner));
        services.Should().Contain(d => d.ServiceType == typeof(ISafeDeletePolicy));
        services.Should().Contain(d => d.ServiceType == typeof(MediaRelationsMetrics));
        services.Should().Contain(d => d.ServiceType == typeof(IHostedService));
    }

    [Fact]
    public async Task ReferenceRepository_SourceBatchAndBlockingQueries()
    {
        using var f = new EngineFixture();
        var assetId = Guid.NewGuid();

        var blocking = TestHelpers.NewReference(assetId, referenceType: ReferenceType.PageValue, sourceReferenceId: "home",
            scope: ReferenceScope.PublishedValue);
        var draft = TestHelpers.NewReference(assetId, referenceType: ReferenceType.PageValue, sourceReferenceId: "home",
            usageType: UsageType.GalleryValue);
        await f.References.AddAsync(blocking);
        await f.References.AddAsync(draft);
        await f.References.SaveChangesAsync();

        var fromSource = await f.References.GetBySourceAsync(ReferenceType.PageValue, "home");
        fromSource.Should().HaveCount(2);

        var batch = await f.References.GetActiveBatchAsync(0, 10);
        batch.Should().HaveCount(2);

        var blockingCount = await f.References.CountBlockingByAssetAsync(assetId);
        blockingCount.Should().Be(1);
    }

    [Fact]
    public async Task RelationRepository_EdgeQueries()
    {
        using var f = new EngineFixture();
        var relation = new MediaRelation("asset:a", GraphNodeType.Asset, "page:home", GraphNodeType.Content, "featured-image");
        await f.Relations.AddAsync(relation);
        await f.Relations.SaveChangesAsync();

        (await f.Relations.GetAllEdgesAsync()).Should().ContainSingle();
        (await f.Relations.GetByTargetNodeAsync("page:home")).Should().ContainSingle();
        (await f.Relations.GetBySourceNodeAsync("asset:a")).Should().ContainSingle();
    }

    [Fact]
    public async Task DependencyRepository_RemoveByAsset()
    {
        using var f = new EngineFixture();
        var assetId = Guid.NewGuid();
        var dependency = new MediaDependency(assetId, "page:home", GraphNodeType.Content, DependencyLevel.Create(1), "asset -> page");
        await f.Dependencies.AddAsync(dependency);
        await f.Dependencies.SaveChangesAsync();

        await f.Dependencies.RemoveByAssetIdAsync(assetId);
        await f.Dependencies.SaveChangesAsync();

        (await f.Dependencies.GetByAssetIdAsync(assetId)).Should().BeEmpty();
    }

    [Fact]
    public async Task StatisticsRepository_MostUsedOrdersByUsage()
    {
        using var f = new EngineFixture();
        var busy = new MediaUsageStatistics(Guid.NewGuid());
        busy.RecordReferenceAdded();
        busy.RecordReferenceAdded();
        var quiet = new MediaUsageStatistics(Guid.NewGuid());
        quiet.RecordReferenceAdded();
        await f.Statistics.AddAsync(busy);
        await f.Statistics.AddAsync(quiet);
        await f.Statistics.SaveChangesAsync();

        var mostUsed = await f.Statistics.GetMostUsedAsync(1);
        mostUsed.Should().ContainSingle().Which.AssetId.Should().Be(busy.AssetId);
    }

    [Fact]
    public async Task SnapshotRepository_ByAssetId()
    {
        using var f = new EngineFixture();
        var assetId = Guid.NewGuid();
        await f.Snapshots.AddAsync(new MediaReferenceSnapshot(assetId, 1, "{}", "first"));
        await f.Snapshots.AddAsync(new MediaReferenceSnapshot(assetId, 2, "{}", "second"));
        await f.Snapshots.SaveChangesAsync();

        var all = await f.Snapshots.GetByAssetIdAsync(assetId);
        all.Should().HaveCount(2);
    }

    [Fact]
    public async Task GraphRepository_RemoveByAsset()
    {
        using var f = new EngineFixture();
        var graph = new MediaRelationshipGraph(Guid.NewGuid());
        graph.AddNode("page:home", GraphNodeType.Content, 1, "page:home");
        await f.Graphs.AddAsync(graph);
        await f.Graphs.SaveChangesAsync();

        await f.Graphs.RemoveByAssetIdAsync(graph.RootAssetId);
        await f.Graphs.SaveChangesAsync();

        (await f.Graphs.GetByAssetIdAsync(graph.RootAssetId)).Should().BeNull();
    }

    [Fact]
    public async Task GenericRepository_AllSingleExistsAndAny()
    {
        using var f = new EngineFixture();
        var reference = TestHelpers.NewReference(Guid.NewGuid());
        await f.References.AddAsync(reference);
        await f.References.SaveChangesAsync();

        (await f.References.GetAllAsync()).Should().ContainSingle();
        (await f.References.ExistsAsync(reference.Id)).Should().BeTrue();
        (await f.References.ExistsAsync(Guid.NewGuid())).Should().BeFalse();

        var single = await f.References.GetSingleAsync(
            new Sathus.MediaRelations.Application.Specifications.ActiveReferencesForAssetSpecification(reference.AssetId));
        single.Should().NotBeNull();
        single!.Id.Should().Be(reference.Id);
    }
}

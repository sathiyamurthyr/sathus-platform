using Microsoft.Extensions.Logging.Abstractions;

namespace Sathus.MediaRelations.Tests;

/// <summary>
/// Wires the real EF repositories and engine services over a single in-memory context so
/// handlers and services can be exercised end-to-end without a database server.
/// </summary>
public sealed class EngineFixture : IDisposable
{
    public MediaRelationsDbContext Context { get; }
    public IMediator Mediator { get; }

    public EfMediaReferenceRepository References { get; }
    public EfMediaUsageRepository Usages { get; }
    public EfMediaRelationRepository Relations { get; }
    public EfMediaDependencyRepository Dependencies { get; }
    public EfMediaReferenceHistoryRepository History { get; }
    public EfMediaUsageStatisticsRepository Statistics { get; }
    public EfMediaReferenceSnapshotRepository Snapshots { get; }
    public EfMediaRelationshipGraphRepository Graphs { get; }

    public NoopGraphCache GraphCache { get; } = new();
    public FakeAssetExistenceChecker AssetChecker { get; } = new();
    public UsageGraphBuilder GraphBuilder { get; }

    public EngineFixture()
    {
        Context = TestHelpers.CreateContext();
        Mediator = TestHelpers.NoopMediator();

        References = new EfMediaReferenceRepository(Context, Mediator);
        Usages = new EfMediaUsageRepository(Context, Mediator);
        Relations = new EfMediaRelationRepository(Context, Mediator);
        Dependencies = new EfMediaDependencyRepository(Context, Mediator);
        History = new EfMediaReferenceHistoryRepository(Context, Mediator);
        Statistics = new EfMediaUsageStatisticsRepository(Context, Mediator);
        Snapshots = new EfMediaReferenceSnapshotRepository(Context, Mediator);
        Graphs = new EfMediaRelationshipGraphRepository(Context, Mediator);

        GraphBuilder = new UsageGraphBuilder(Relations, GraphCache);
    }

    public ReferenceScanner CreateScanner() => new(
        References, History, AssetChecker, GraphBuilder, GraphCache, NullLogger<ReferenceScanner>.Instance);

    public SafeDeletePolicy CreateSafeDeletePolicy() => new(References, Statistics, GraphBuilder);

    public void Dispose() => Context.Dispose();
}

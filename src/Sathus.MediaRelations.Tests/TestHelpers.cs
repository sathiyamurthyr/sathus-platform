using Sathus.MediaRelations.Domain.ValueObjects;

namespace Sathus.MediaRelations.Tests;

/// <summary>Shared helpers for building in-memory contexts, repositories and references.</summary>
public static class TestHelpers
{
    public static MediaRelationsDbContext CreateContext() =>
        new(new DbContextOptionsBuilder<MediaRelationsDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options);

    public static IMediator NoopMediator() => new Mock<IMediator>().Object;

    public static MediaReference NewReference(
        Guid? assetId = null,
        string module = "web",
        string referenceType = ReferenceType.PageValue,
        string sourceReferenceId = "home",
        string usageType = UsageType.FeaturedImageValue,
        string? path = null,
        string? scope = null,
        DateTime? scheduledFor = null)
    {
        return new MediaReference(
            assetId ?? Guid.NewGuid(),
            module,
            ReferenceType.Create(referenceType),
            ReferenceId.Create(sourceReferenceId),
            UsageType.Create(usageType),
            path is null ? ReferencePath.Create(null) : ReferencePath.Create(path),
            scope is null ? ReferenceScope.Draft : ReferenceScope.Create(scope),
            tenantId: null,
            title: "Title",
            url: "/x",
            scheduledFor: scheduledFor,
            createdBy: Guid.NewGuid());
    }
}

/// <summary>Configurable asset existence checker for tests.</summary>
public sealed class FakeAssetExistenceChecker : IAssetExistenceChecker
{
    private readonly HashSet<Guid> _existing;

    public FakeAssetExistenceChecker(params Guid[] existing) => _existing = existing.ToHashSet();

    public void Add(Guid id) => _existing.Add(id);

    public void Remove(Guid id) => _existing.Remove(id);

    public Task<bool> ExistsAsync(Guid assetId, CancellationToken cancellationToken = default) =>
        Task.FromResult(_existing.Contains(assetId));

    public Task<IReadOnlySet<Guid>> ExistingAsync(IReadOnlyCollection<Guid> assetIds, CancellationToken cancellationToken = default) =>
        Task.FromResult((IReadOnlySet<Guid>)assetIds.Where(_existing.Contains).ToHashSet());
}

/// <summary>Simple non-caching graph cache stub for tests.</summary>
public sealed class NoopGraphCache : IUsageGraphCache
{
    public Task<MediaRelationshipGraph?> GetAsync(Guid assetId, CancellationToken cancellationToken = default) =>
        Task.FromResult<MediaRelationshipGraph?>(null);

    public Task SetAsync(MediaRelationshipGraph graph, CancellationToken cancellationToken = default) => Task.CompletedTask;

    public Task InvalidateAsync(Guid assetId, CancellationToken cancellationToken = default) => Task.CompletedTask;
}

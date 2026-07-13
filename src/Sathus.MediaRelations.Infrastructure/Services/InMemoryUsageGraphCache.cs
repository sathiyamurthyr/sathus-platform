using Microsoft.Extensions.Caching.Memory;
using Sathus.MediaRelations.Application.Interfaces;
using Sathus.MediaRelations.Domain.Entities;

namespace Sathus.MediaRelations.Infrastructure.Services;

/// <summary>
/// In-memory cache of materialised usage graphs. Graphs are cached per asset with a sliding
/// expiration and invalidated incrementally whenever the asset's references change.
/// </summary>
public sealed class InMemoryUsageGraphCache : IUsageGraphCache
{
    private readonly IMemoryCache _cache;
    private static readonly TimeSpan Ttl = TimeSpan.FromMinutes(10);

    public InMemoryUsageGraphCache(IMemoryCache cache)
    {
        _cache = cache;
    }

    private static string Key(Guid assetId) => $"usage-graph:{assetId:N}";

    public Task<MediaRelationshipGraph?> GetAsync(Guid assetId, CancellationToken cancellationToken = default) =>
        Task.FromResult(_cache.TryGetValue(Key(assetId), out MediaRelationshipGraph? graph) ? graph : null);

    public Task SetAsync(MediaRelationshipGraph graph, CancellationToken cancellationToken = default)
    {
        _cache.Set(Key(graph.RootAssetId), graph, new MemoryCacheEntryOptions
        {
            SlidingExpiration = Ttl,
            Size = Math.Max(1, graph.Nodes.Count + graph.Edges.Count)
        });
        return Task.CompletedTask;
    }

    public Task InvalidateAsync(Guid assetId, CancellationToken cancellationToken = default)
    {
        _cache.Remove(Key(assetId));
        return Task.CompletedTask;
    }
}

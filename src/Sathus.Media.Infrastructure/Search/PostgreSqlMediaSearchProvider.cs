using System.Linq;
using Microsoft.EntityFrameworkCore;
using Sathus.Media.Application.Interfaces;
using Sathus.Media.Domain.Entities;
using Sathus.Media.Domain.Enums;
using Sathus.SharedKernel.Paging;
using Sathus.Media.Infrastructure.Persistence;

namespace Sathus.Media.Infrastructure.Search;

/// <summary>
/// Search provider backed directly by PostgreSQL. Reads live data from the media
/// catalogue so no separate index synchronisation is required. Swapping to
/// Meilisearch/OpenSearch/Elastic only means implementing <see cref="IMediaSearchProvider"/>.
/// </summary>
public sealed class PostgreSqlMediaSearchProvider : IMediaSearchProvider
{
    private readonly MediaDbContext _dbContext;

    public PostgreSqlMediaSearchProvider(MediaDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResult<MediaAsset>> SearchAsync(MediaSearchCriteria criteria, CancellationToken cancellationToken = default)
    {
        var query = _dbContext.MediaAssets.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(criteria.Term))
        {
            var term = criteria.Term.Trim();
            if (_dbContext.Database.IsRelational())
            {
                query = query.Where(a =>
                    EF.Functions.ILike(a.FileName.Value, $"%{term}%") ||
                    (a.Title != null && EF.Functions.ILike(a.Title, $"%{term}%")) ||
                    (a.AltText != null && a.AltText.Value != null && EF.Functions.ILike(a.AltText.Value, $"%{term}%")));
            }
            else
            {
                var lowered = term.ToLowerInvariant();
                query = query.Where(a =>
                    a.FileName.Value.ToLower().Contains(lowered) ||
                    (a.Title != null && a.Title.ToLower().Contains(lowered)) ||
                    (a.AltText != null && a.AltText.Value != null && a.AltText.Value.ToLower().Contains(lowered)));
            }
        }

        if (criteria.Types is { Count: > 0 })
        {
            var types = criteria.Types.Select(t => t.ToLowerInvariant()).ToList();
            query = query.Where(a => types.Contains(a.Type.Value));
        }

        if (criteria.Tags is { Count: > 0 })
        {
            var tags = criteria.Tags.Select(t => t.ToLowerInvariant()).ToList();
            query = query.Where(a => a.Tags.Any(t => t.Tag != null && tags.Contains(t.Tag.Slug)));
        }

        if (criteria.FolderId.HasValue)
        {
            query = query.Where(a => a.FolderId == criteria.FolderId);
        }

        if (!string.IsNullOrWhiteSpace(criteria.Status) &&
            Enum.TryParse<MediaStatus>(criteria.Status, ignoreCase: true, out var status))
        {
            query = query.Where(a => a.Status == status);
        }

        if (!string.IsNullOrWhiteSpace(criteria.Language))
        {
            query = query.Where(a => a.Language.Value == criteria.Language);
        }

        if (criteria.From.HasValue)
        {
            query = query.Where(a => a.CreatedAt >= criteria.From.Value);
        }

        if (criteria.To.HasValue)
        {
            query = query.Where(a => a.CreatedAt <= criteria.To.Value);
        }

        var total = await query.CountAsync(cancellationToken);

        query = criteria.SortBy?.ToLowerInvariant() switch
        {
            "filename" => criteria.Descending
                ? query.OrderByDescending(a => a.FileName.Value)
                : query.OrderBy(a => a.FileName.Value),
            "size" => criteria.Descending
                ? query.OrderByDescending(a => a.Size.Bytes)
                : query.OrderBy(a => a.Size.Bytes),
            "updatedat" => criteria.Descending
                ? query.OrderByDescending(a => a.UpdatedAt)
                : query.OrderBy(a => a.UpdatedAt),
            _ => criteria.Descending
                ? query.OrderByDescending(a => a.CreatedAt)
                : query.OrderBy(a => a.CreatedAt)
        };

        var items = await query
            .Skip(criteria.Skip)
            .Take(criteria.Take)
            .ToListAsync(cancellationToken);

        return new PagedResult<MediaAsset>(items, criteria.Page, criteria.PageSize, total);
    }

    public Task IndexAsync(MediaAsset asset, CancellationToken cancellationToken = default) =>
        Task.CompletedTask;

    public Task RemoveAsync(Guid assetId, CancellationToken cancellationToken = default) =>
        Task.CompletedTask;
}

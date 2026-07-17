namespace Sathus.Content.Infrastructure.Repositories;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Sathus.Content.Application.DTOs;
using Sathus.Content.Application.Interfaces;
using Sathus.Content.Domain.Entities;
using Sathus.Content.Domain.Enums;
using Sathus.Content.Infrastructure.Persistence;

public class ContentItemRepository(ContentDbContext dbContext) : IContentItemRepository
{
    private readonly DbSet<ContentItem> _dbSet = dbContext.Set<ContentItem>();

    public async Task<ContentItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(c => c.Categories)
            .Include(c => c.Tags)
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
    }

    public async Task<ContentItem?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(c => c.Categories)
            .Include(c => c.Tags)
            .FirstOrDefaultAsync(c => c.Slug.Value == slug, cancellationToken);
    }

    public async Task<bool> ExistsBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        return await _dbSet.AnyAsync(c => c.Slug.Value == slug, cancellationToken);
    }

    public async Task AddAsync(ContentItem entity, CancellationToken cancellationToken = default)
    {
        await _dbSet.AddAsync(entity, cancellationToken);
    }

    public async Task UpdateAsync(ContentItem entity, CancellationToken cancellationToken = default)
    {
        _dbSet.Update(entity);
        await Task.CompletedTask;
    }

    public async Task DeleteAsync(ContentItem entity, CancellationToken cancellationToken = default)
    {
        _dbSet.Remove(entity);
        await Task.CompletedTask;
    }

    public async Task<PagedResult<ContentItem>> GetPagedAsync(
        int page,
        int pageSize,
        ContentType? contentType,
        ContentStatus? status,
        Guid? categoryId,
        Guid? tagId,
        string? search,
        string? sortBy,
        bool sortDescending,
        CancellationToken cancellationToken = default)
    {
        var query = _dbSet.AsNoTracking();

        if (contentType.HasValue)
        {
            query = query.Where(c => c.ContentType == contentType.Value);
        }

        if (status.HasValue)
        {
            query = query.Where(c => c.Status == status.Value);
        }

        if (categoryId.HasValue)
        {
            query = query.Where(c => c.Categories.Any(cc => cc.CategoryId == categoryId.Value));
        }

        if (tagId.HasValue)
        {
            query = query.Where(c => c.Tags.Any(ct => ct.TagId == tagId.Value));
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var normalized = search.Trim().ToLowerInvariant();
            query = query.Where(c =>
                c.Title.ToLower().Contains(normalized) ||
                c.Description!.ToLower().Contains(normalized) ||
                c.Body.ToLower().Contains(normalized));
        }

        query = sortBy?.ToLowerInvariant() switch
        {
            "title" => sortDescending ? query.OrderByDescending(c => c.Title) : query.OrderBy(c => c.Title),
            "publishedat" => sortDescending ? query.OrderByDescending(c => c.PublishedAt) : query.OrderBy(c => c.PublishedAt),
            "slug" => sortDescending ? query.OrderByDescending(c => c.Slug.Value) : query.OrderBy(c => c.Slug.Value),
            _ => sortDescending ? query.OrderByDescending(c => c.CreatedAt) : query.OrderBy(c => c.CreatedAt),
        };

        var total = await query.CountAsync(cancellationToken);

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<ContentItem>(items, page, pageSize, total);
    }
}

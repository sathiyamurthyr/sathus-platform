using Sathus.Content.Domain.Entities;
using Sathus.Content.Domain.Enums;

namespace Sathus.Content.Application.Interfaces;

public interface IContentItemRepository
{
    Task<ContentItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<ContentItem?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);

    Task<bool> ExistsBySlugAsync(string slug, CancellationToken cancellationToken = default);

    Task AddAsync(ContentItem entity, CancellationToken cancellationToken = default);

    Task UpdateAsync(ContentItem entity, CancellationToken cancellationToken = default);

    Task DeleteAsync(ContentItem entity, CancellationToken cancellationToken = default);

    Task<PagedResult<ContentItem>> GetPagedAsync(
        int page,
        int pageSize,
        ContentType? contentType,
        ContentStatus? status,
        Guid? categoryId,
        Guid? tagId,
        string? search,
        string? sortBy,
        bool sortDescending,
        CancellationToken cancellationToken = default);
}

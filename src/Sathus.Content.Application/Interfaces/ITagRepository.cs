using Sathus.Content.Domain.Entities;

namespace Sathus.Content.Application.Interfaces;

public interface ITagRepository
{
    Task<Tag?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<Tag?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Tag>> GetAllAsync(CancellationToken cancellationToken = default);

    Task AddAsync(Tag entity, CancellationToken cancellationToken = default);

    Task DeleteAsync(Tag entity, CancellationToken cancellationToken = default);
}

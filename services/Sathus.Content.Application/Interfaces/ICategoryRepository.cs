using Sathus.Content.Domain.Entities;

namespace Sathus.Content.Application.Interfaces;

public interface ICategoryRepository
{
    Task<Category?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<Category?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);

    Task<bool> ExistsBySlugAsync(string slug, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Category>> GetAllAsync(CancellationToken cancellationToken = default);

    Task AddAsync(Category entity, CancellationToken cancellationToken = default);

    Task UpdateAsync(Category entity, CancellationToken cancellationToken = default);

    Task DeleteAsync(Category entity, CancellationToken cancellationToken = default);
}

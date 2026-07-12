using Sathus.Content.Domain.Entities;

namespace Sathus.Content.Application.Interfaces;

public interface IMediaAssetRepository
{
    Task<MediaAsset?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<MediaAsset>> GetAllAsync(CancellationToken cancellationToken = default);

    Task AddAsync(MediaAsset entity, CancellationToken cancellationToken = default);

    Task UpdateAsync(MediaAsset entity, CancellationToken cancellationToken = default);

    Task DeleteAsync(MediaAsset entity, CancellationToken cancellationToken = default);
}

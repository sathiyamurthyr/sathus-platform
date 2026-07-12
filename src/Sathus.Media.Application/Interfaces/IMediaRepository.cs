using Sathus.Media.Domain.Entities;
using Sathus.SharedKernel.Repositories;

namespace Sathus.Media.Application.Interfaces;

/// <summary>
/// Repository for media assets with specification support and media-specific lookups.
/// </summary>
public interface IMediaRepository : IRepository<MediaAsset>
{
    Task<IReadOnlyList<MediaAsset>> GetByFolderIdAsync(Guid? folderId, CancellationToken cancellationToken = default);

    Task<MediaAsset?> GetByStorageKeyAsync(StorageKey storageKey, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<MediaAsset>> GetByChecksumAsync(Checksum checksum, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<MediaAsset>> GetByTagAsync(Guid tagId, CancellationToken cancellationToken = default);
}

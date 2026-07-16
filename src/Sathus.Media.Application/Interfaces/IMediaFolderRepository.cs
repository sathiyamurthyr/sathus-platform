using Sathus.Media.Domain.Entities;
using Sathus.SharedKernel.Repositories;

namespace Sathus.Media.Application.Interfaces;

public interface IMediaFolderRepository : IRepository<MediaFolder>
{
    Task<IReadOnlyList<MediaFolder>> GetRootsAsync(CancellationToken cancellationToken = default);

    Task<IReadOnlyList<MediaFolder>> GetChildrenAsync(Guid parentFolderId, CancellationToken cancellationToken = default);
}

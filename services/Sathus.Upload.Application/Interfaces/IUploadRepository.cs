using Sathus.SharedKernel.Repositories;
using Sathus.Upload.Domain.Entities;

namespace Sathus.Upload.Application.Interfaces;

public interface IUploadRepository : IRepository<UploadSession>
{
    Task<UploadSession?> GetBySessionIdAsync(string sessionId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<UploadSession>> GetActiveSessionsAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<UploadSession>> GetByCreatedByAsync(Guid createdBy, CancellationToken cancellationToken = default);
}

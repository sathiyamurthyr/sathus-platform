using Sathus.SharedKernel.Repositories;
using Sathus.Processing.Domain.Entities;
using Sathus.Processing.Domain.Enums;

namespace Sathus.Processing.Application.Interfaces;

public interface IProcessingJobRepository : IRepository<AssetProcessingJob>
{
    Task<AssetProcessingJob?> GetByAssetIdAsync(Guid assetId, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<AssetProcessingJob>> GetByStatusAsync(ProcessingStatus status, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<AssetProcessingJob>> GetJobsAsync(
        ProcessingStatus? status,
        string? mediaType,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default);

    Task<int> CountByStatusAsync(ProcessingStatus status, CancellationToken cancellationToken = default);

    Task<int> CountJobsAsync(
        ProcessingStatus? status,
        string? mediaType,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<AssetProcessingJob>> GetDeadLetteredAsync(CancellationToken cancellationToken = default);
}

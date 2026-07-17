using Microsoft.EntityFrameworkCore;
using Sathus.Processing.Application.Interfaces;
using Sathus.Processing.Domain.Enums;
using Sathus.Processing.Infrastructure.Persistence;

namespace Sathus.Processing.Infrastructure.Services;

/// <summary>
/// Detects duplicate assets by comparing content checksums against previously
/// succeeded processing jobs. Returns the original asset id when a duplicate is found.
/// </summary>
public sealed class DefaultDuplicateDetector : IDuplicateDetector
{
    private readonly ProcessingDbContext _dbContext;

    public DefaultDuplicateDetector(ProcessingDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Guid?> DetectAsync(string checksum, Guid assetId, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(checksum))
        {
            return null;
        }

        var existing = await _dbContext.ProcessingJobs
            .AsNoTracking()
            .Where(j => j.Checksum == checksum && j.AssetId != assetId && j.Status == ProcessingStatus.Succeeded)
            .OrderBy(j => j.CreatedAt)
            .Select(j => j.AssetId)
            .FirstOrDefaultAsync(cancellationToken);

        return existing == Guid.Empty ? null : existing;
    }
}

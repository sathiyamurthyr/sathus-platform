using Microsoft.EntityFrameworkCore;
using MediatR;
using Sathus.SharedKernel.Entities;
using Sathus.SharedKernel.Repositories;
using Sathus.SharedKernel.Specifications;
using Sathus.Processing.Application.Interfaces;
using Sathus.Processing.Application.Specifications;
using Sathus.Processing.Domain.Entities;
using Sathus.Processing.Domain.Enums;
using Sathus.Processing.Infrastructure.Persistence;

namespace Sathus.Processing.Infrastructure.Repositories;

public sealed class EfProcessingJobRepository : IProcessingJobRepository
{
    private readonly ProcessingDbContext _dbContext;
    private readonly IMediator _mediator;
    private readonly DbSet<AssetProcessingJob> _dbSet;

    public EfProcessingJobRepository(ProcessingDbContext dbContext, IMediator mediator)
    {
        _dbContext = dbContext;
        _mediator = mediator;
        _dbSet = dbContext.Set<AssetProcessingJob>();
    }

    public async Task<AssetProcessingJob?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        await _dbSet.AsNoTracking().FirstOrDefaultAsync(e => e.Id == id, cancellationToken);

    public async Task<IReadOnlyList<AssetProcessingJob>> GetAllAsync(CancellationToken cancellationToken = default) =>
        await _dbSet.AsNoTracking().ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<AssetProcessingJob>> GetAsync(ISpecification<AssetProcessingJob> specification, CancellationToken cancellationToken = default) =>
        await SpecificationEvaluator.GetQuery(_dbSet.AsQueryable(), specification).ToListAsync(cancellationToken);

    public async Task<AssetProcessingJob?> GetSingleAsync(ISpecification<AssetProcessingJob> specification, CancellationToken cancellationToken = default) =>
        await SpecificationEvaluator.GetQuery(_dbSet.AsQueryable(), specification).FirstOrDefaultAsync(cancellationToken);

    public async Task<int> CountAsync(ISpecification<AssetProcessingJob> specification, CancellationToken cancellationToken = default) =>
        await SpecificationEvaluator.GetQuery(_dbSet.AsQueryable(), specification).CountAsync(cancellationToken);

    public async Task<bool> AnyAsync(ISpecification<AssetProcessingJob> specification, CancellationToken cancellationToken = default) =>
        await SpecificationEvaluator.GetQuery(_dbSet.AsQueryable(), specification).AnyAsync(cancellationToken);

    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default) =>
        await _dbSet.AnyAsync(e => e.Id == id, cancellationToken);

    public async Task AddAsync(AssetProcessingJob entity, CancellationToken cancellationToken = default) =>
        await _dbSet.AddAsync(entity, cancellationToken);

    public Task UpdateAsync(AssetProcessingJob entity, CancellationToken cancellationToken = default)
    {
        _dbSet.Update(entity);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(AssetProcessingJob entity, CancellationToken cancellationToken = default)
    {
        _dbSet.Remove(entity);
        return Task.CompletedTask;
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var affected = await _dbContext.SaveChangesAsync(cancellationToken);
        await DispatchDomainEventsAsync(cancellationToken);
        return affected;
    }

    public async Task<AssetProcessingJob?> GetByAssetIdAsync(Guid assetId, CancellationToken cancellationToken = default) =>
        await _dbSet.AsNoTracking()
            .Where(j => j.AssetId == assetId)
            .OrderByDescending(j => j.CreatedAt)
            .FirstOrDefaultAsync(cancellationToken);

    public async Task<IReadOnlyList<AssetProcessingJob>> GetByStatusAsync(ProcessingStatus status, CancellationToken cancellationToken = default) =>
        await _dbSet.AsNoTracking().Where(j => j.Status == status).ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<AssetProcessingJob>> GetJobsAsync(
        ProcessingStatus? status, string? mediaType, int page, int pageSize, CancellationToken cancellationToken = default) =>
        await GetAsync(new AssetProcessingJobSpecifications.PagedByStatusAndMediaType(status, mediaType, page, pageSize), cancellationToken);

    public async Task<int> CountByStatusAsync(ProcessingStatus status, CancellationToken cancellationToken = default) =>
        await _dbSet.AsNoTracking().CountAsync(j => j.Status == status, cancellationToken);

    public async Task<int> CountJobsAsync(ProcessingStatus? status, string? mediaType, CancellationToken cancellationToken = default) =>
        await CountAsync(new AssetProcessingJobSpecifications.ByStatusAndMediaType(status, mediaType), cancellationToken);

    public async Task<IReadOnlyList<AssetProcessingJob>> GetDeadLetteredAsync(CancellationToken cancellationToken = default) =>
        await GetByStatusAsync(ProcessingStatus.DeadLettered, cancellationToken);

    private async Task DispatchDomainEventsAsync(CancellationToken cancellationToken)
    {
        var aggregates = _dbContext.ChangeTracker.Entries<AggregateRoot>()
            .Where(e => e.Entity.DomainEvents.Count > 0)
            .Select(e => e.Entity)
            .ToList();

        foreach (var aggregate in aggregates)
        {
            var events = aggregate.DomainEvents.ToList();
            aggregate.ClearDomainEvents();
            foreach (var domainEvent in events)
            {
                await _mediator.Publish((INotification)domainEvent, cancellationToken);
            }
        }
    }
}

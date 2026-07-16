using Microsoft.EntityFrameworkCore;
using MediatR;
using Sathus.SharedKernel.Entities;
using Sathus.SharedKernel.Repositories;
using Sathus.SharedKernel.Specifications;
using Sathus.Upload.Application.Interfaces;
using Sathus.Upload.Domain.Entities;
using Sathus.Upload.Domain.Enums;
using Sathus.Upload.Infrastructure.Persistence;

namespace Sathus.Upload.Infrastructure.Repositories;

public sealed class EfUploadRepository : IUploadRepository
{
    private readonly UploadDbContext _dbContext;
    private readonly IMediator _mediator;
    private readonly DbSet<UploadSession> _dbSet;

    public EfUploadRepository(UploadDbContext dbContext, IMediator mediator)
    {
        _dbContext = dbContext;
        _mediator = mediator;
        _dbSet = dbContext.Set<UploadSession>();
    }

    public async Task<UploadSession?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        await _dbSet.Include(s => s.Chunks).AsNoTracking().FirstOrDefaultAsync(e => e.Id == id, cancellationToken);

    public async Task<IReadOnlyList<UploadSession>> GetAllAsync(CancellationToken cancellationToken = default) =>
        await _dbSet.AsNoTracking().ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<UploadSession>> GetAsync(ISpecification<UploadSession> specification, CancellationToken cancellationToken = default) =>
        await SpecificationEvaluator.GetQuery(_dbSet.AsQueryable(), specification).ToListAsync(cancellationToken);

    public async Task<UploadSession?> GetSingleAsync(ISpecification<UploadSession> specification, CancellationToken cancellationToken = default) =>
        await SpecificationEvaluator.GetQuery(_dbSet.AsQueryable(), specification).FirstOrDefaultAsync(cancellationToken);

    public async Task<int> CountAsync(ISpecification<UploadSession> specification, CancellationToken cancellationToken = default) =>
        await SpecificationEvaluator.GetQuery(_dbSet.AsQueryable(), specification).CountAsync(cancellationToken);

    public async Task<bool> AnyAsync(ISpecification<UploadSession> specification, CancellationToken cancellationToken = default) =>
        await SpecificationEvaluator.GetQuery(_dbSet.AsQueryable(), specification).AnyAsync(cancellationToken);

    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default) =>
        await _dbSet.AnyAsync(e => e.Id == id, cancellationToken);

    public async Task AddAsync(UploadSession entity, CancellationToken cancellationToken = default)
    {
        await _dbSet.AddAsync(entity, cancellationToken);
    }

    public Task UpdateAsync(UploadSession entity, CancellationToken cancellationToken = default)
    {
        _dbSet.Update(entity);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(UploadSession entity, CancellationToken cancellationToken = default)
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

    public async Task<UploadSession?> GetBySessionIdAsync(string sessionId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(s => s.Chunks)
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.SessionId == sessionId, cancellationToken);
    }

    public async Task<IReadOnlyList<UploadSession>> GetActiveSessionsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(s => s.Chunks)
            .AsNoTracking()
            .Where(s => s.Status == UploadStatus.Uploading || s.Status == UploadStatus.Paused)
            .OrderByDescending(s => s.StartedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<UploadSession>> GetByCreatedByAsync(Guid createdBy, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(s => s.Chunks)
            .AsNoTracking()
            .Where(s => s.CreatedBy == createdBy)
            .OrderByDescending(s => s.StartedAt)
            .ToListAsync(cancellationToken);
    }

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

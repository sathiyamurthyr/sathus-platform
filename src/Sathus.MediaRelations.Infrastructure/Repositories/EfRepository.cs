using MediatR;
using Microsoft.EntityFrameworkCore;
using Sathus.MediaRelations.Infrastructure.Persistence;
using Sathus.SharedKernel.Entities;
using Sathus.SharedKernel.Repositories;
using Sathus.SharedKernel.Specifications;

namespace Sathus.MediaRelations.Infrastructure.Repositories;

/// <summary>
/// Generic EF Core repository providing specification support and domain-event dispatch
/// on save. Concrete repositories extend it with aggregate-specific queries.
/// </summary>
public abstract class EfRepository<T> : IRepository<T> where T : Entity
{
    protected readonly MediaRelationsDbContext DbContext;
    protected readonly DbSet<T> DbSet;
    private readonly IMediator _mediator;

    protected EfRepository(MediaRelationsDbContext dbContext, IMediator mediator)
    {
        DbContext = dbContext;
        _mediator = mediator;
        DbSet = dbContext.Set<T>();
    }

    public virtual async Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        await DbSet.FirstOrDefaultAsync(e => e.Id == id, cancellationToken);

    public virtual async Task<IReadOnlyList<T>> GetAllAsync(CancellationToken cancellationToken = default) =>
        await DbSet.AsNoTracking().ToListAsync(cancellationToken);

    public virtual async Task<IReadOnlyList<T>> GetAsync(ISpecification<T> specification, CancellationToken cancellationToken = default) =>
        await SpecificationEvaluator.GetQuery(DbSet.AsQueryable(), specification).ToListAsync(cancellationToken);

    public virtual async Task<T?> GetSingleAsync(ISpecification<T> specification, CancellationToken cancellationToken = default) =>
        await SpecificationEvaluator.GetQuery(DbSet.AsQueryable(), specification).FirstOrDefaultAsync(cancellationToken);

    public virtual async Task<int> CountAsync(ISpecification<T> specification, CancellationToken cancellationToken = default) =>
        await SpecificationEvaluator.GetQuery(DbSet.AsQueryable(), specification).CountAsync(cancellationToken);

    public virtual async Task<bool> AnyAsync(ISpecification<T> specification, CancellationToken cancellationToken = default) =>
        await SpecificationEvaluator.GetQuery(DbSet.AsQueryable(), specification).AnyAsync(cancellationToken);

    public virtual async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default) =>
        await DbSet.AnyAsync(e => e.Id == id, cancellationToken);

    public virtual async Task AddAsync(T entity, CancellationToken cancellationToken = default) =>
        await DbSet.AddAsync(entity, cancellationToken);

    public virtual Task UpdateAsync(T entity, CancellationToken cancellationToken = default)
    {
        DbSet.Update(entity);
        return Task.CompletedTask;
    }

    public virtual Task DeleteAsync(T entity, CancellationToken cancellationToken = default)
    {
        DbSet.Remove(entity);
        return Task.CompletedTask;
    }

    public virtual async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var affected = await DbContext.SaveChangesAsync(cancellationToken);
        await DispatchDomainEventsAsync(cancellationToken);
        return affected;
    }

    private async Task DispatchDomainEventsAsync(CancellationToken cancellationToken)
    {
        var aggregates = DbContext.ChangeTracker.Entries<AggregateRoot>()
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

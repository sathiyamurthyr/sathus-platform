namespace Sathus.SharedKernel.Events;

using MediatR;

/// <summary>
/// Base class for domain events carrying correlation metadata. Implements
/// <see cref="INotification"/> so aggregates can publish events through MediatR.
/// </summary>
public abstract class DomainEvent : IDomainEvent, INotification
{
    public Guid Id { get; } = Guid.NewGuid();

    public DateTime OccurredAt { get; } = DateTime.UtcNow;
}

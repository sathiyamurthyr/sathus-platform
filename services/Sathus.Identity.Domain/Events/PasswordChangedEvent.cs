namespace Sathus.Identity.Domain.Events;

public sealed class PasswordChangedEvent : DomainEvent
{
    public Guid UserId { get; }

    public PasswordChangedEvent(Guid userId)
    {
        if (userId == Guid.Empty) throw new ArgumentException("UserId is required.", nameof(userId));

        UserId = userId;
    }
}

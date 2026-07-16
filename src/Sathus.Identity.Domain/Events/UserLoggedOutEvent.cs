namespace Sathus.Identity.Domain.Events;

public sealed class UserLoggedOutEvent : DomainEvent
{
    public Guid UserId { get; }
    public string SessionId { get; }

    public UserLoggedOutEvent(Guid userId, string sessionId)
    {
        if (userId == Guid.Empty) throw new ArgumentException("UserId is required.", nameof(userId));
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);

        UserId = userId;
        SessionId = sessionId;
    }
}

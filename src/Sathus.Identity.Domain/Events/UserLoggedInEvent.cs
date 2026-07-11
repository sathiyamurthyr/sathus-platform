namespace Sathus.Identity.Domain.Events;

public sealed class UserLoggedInEvent : DomainEvent
{
    public Guid UserId { get; }
    public string? IpAddress { get; }

    public UserLoggedInEvent(Guid userId, string? ipAddress)
    {
        if (userId == Guid.Empty) throw new ArgumentException("UserId is required.", nameof(userId));

        UserId = userId;
        IpAddress = ipAddress;
    }
}

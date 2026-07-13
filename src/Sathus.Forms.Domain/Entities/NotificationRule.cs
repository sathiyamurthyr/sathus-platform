using Sathus.Forms.Domain.Enums;

namespace Sathus.Forms.Domain.Entities;

/// <summary>A notification fired by a workflow step (email, webhook, internal, sms, slack).</summary>
public sealed class NotificationRule : Entity
{
    public Guid StepId { get; private set; }

    public NotificationChannel Channel { get; private set; }

    public string Recipient { get; private set; } = string.Empty;

    public string? Template { get; private set; }

    public string? ConditionJson { get; private set; }

    private NotificationRule()
    {
    }

    public static NotificationRule Create(
        Guid stepId,
        NotificationChannel channel,
        string recipient,
        string? template = null,
        string? conditionJson = null,
        Guid? createdBy = null) =>
        new()
        {
            Id = Guid.NewGuid(),
            StepId = stepId,
            Channel = channel,
            Recipient = (recipient ?? string.Empty).Trim(),
            Template = template,
            ConditionJson = conditionJson,
            CreatedBy = createdBy,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
}

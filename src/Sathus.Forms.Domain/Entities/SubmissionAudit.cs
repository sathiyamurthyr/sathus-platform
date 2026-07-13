using Sathus.Forms.Domain.Enums;

namespace Sathus.Forms.Domain.Entities;

/// <summary>Append-only audit entry recording every state change of a submission.</summary>
public sealed class SubmissionAudit : Entity
{
    public Guid SubmissionId { get; private set; }

    public string Action { get; private set; } = string.Empty;

    public string? PerformedBy { get; private set; }

    public string? Note { get; private set; }

    public SubmissionStatus ResultingStatus { get; private set; }

    public DateTime At { get; private set; }

    private SubmissionAudit()
    {
    }

    public static SubmissionAudit Create(
        Guid submissionId,
        string action,
        string? performedBy,
        string? note,
        SubmissionStatus resultingStatus,
        DateTime at,
        Guid? id = null)
    {
        return new SubmissionAudit
        {
            Id = id ?? Guid.NewGuid(),
            SubmissionId = submissionId,
            Action = action,
            PerformedBy = performedBy,
            Note = note,
            ResultingStatus = resultingStatus,
            At = at,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }
}

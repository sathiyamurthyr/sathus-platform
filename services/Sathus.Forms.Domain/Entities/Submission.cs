using System.Text.Json;
using Sathus.Forms.Domain.Enums;
using Sathus.Forms.Domain.Events;
using Sathus.Forms.Domain.Exceptions;

namespace Sathus.Forms.Domain.Entities;

/// <summary>
/// A single response to a published form. Owns its field data (JSON), attachments and an
/// append-only audit history. Drives the submission review/approval workflow.
/// </summary>
public sealed class Submission : AggregateRoot
{
    public Guid FormId { get; private set; }

    public Guid? FormVersionId { get; private set; }

    public SubmissionStatus Status { get; private set; } = SubmissionStatus.Submitted;

    public string Data { get; private set; } = "{}";

    public string? SubmitterName { get; private set; }

    public string? SubmitterEmail { get; private set; }

    public string? SubmittedBy { get; private set; }

    public DateTime SubmittedAt { get; private set; } = DateTime.UtcNow;

    public double SpamScore { get; private set; }

    public string? AssignedTo { get; private set; }

    public string? IpAddress { get; private set; }

    public string? UserAgent { get; private set; }

    public string? ReviewNote { get; private set; }

    public ICollection<SubmissionAttachment> Attachments { get; } = new List<SubmissionAttachment>();

    public ICollection<SubmissionAudit> Audit { get; } = new List<SubmissionAudit>();

    private Submission()
    {
    }

    public static Submission Submit(
        Guid formId,
        Guid? formVersionId,
        IDictionary<string, object?> values,
        string? submitterName = null,
        string? submitterEmail = null,
        string? submittedBy = null,
        string? ipAddress = null,
        string? userAgent = null,
        double spamScore = 0,
        bool isSpam = false,
        Guid? actorId = null)
    {
        var data = JsonSerializer.Serialize(values, new JsonSerializerOptions { WriteIndented = false });
        var submission = new Submission
        {
            Id = Guid.NewGuid(),
            FormId = formId,
            FormVersionId = formVersionId,
            Data = data,
            SubmitterName = submitterName?.Trim() switch { "" => null, var v => v },
            SubmitterEmail = submitterEmail?.Trim() switch { "" => null, var v => v },
            SubmittedBy = submittedBy,
            SubmittedAt = DateTime.UtcNow,
            SpamScore = spamScore,
            IpAddress = ipAddress,
            UserAgent = userAgent,
            Status = isSpam ? SubmissionStatus.Spam : SubmissionStatus.Submitted,
            CreatedBy = actorId ?? (submittedBy is null ? null : Guid.TryParse(submittedBy, out var id) ? id : null),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        if (isSpam)
        {
            submission.RecordAudit("Submitted", actorId?.ToString() ?? submittedBy, "Flagged as spam by classifier.", SubmissionStatus.Spam);
        }
        else
        {
            submission.RecordAudit("Submitted", actorId?.ToString() ?? submittedBy, null, SubmissionStatus.Submitted);
        }

        submission.AddDomainEvent(new SubmissionReceivedEvent(submission.Id, formId, isSpam));
        return submission;
    }

    public void Assign(string assigneeId, string? performedBy = null)
    {
        if (Status is SubmissionStatus.Approved or SubmissionStatus.Rejected or SubmissionStatus.Completed)
        {
            throw new SubmissionInvalidOperationException($"Cannot assign a submission in '{Status}' state.");
        }

        AssignedTo = assigneeId;
        RecordAudit("Assigned", performedBy, $"Assigned to {assigneeId}.", SubmissionStatus.Assigned);
        Status = SubmissionStatus.Assigned;
        SetUpdateAudit(Guid.TryParse(performedBy, out var id) ? id : null, DateTime.UtcNow);
    }

    public void StartReview(string? performedBy = null)
    {
        if (Status is SubmissionStatus.Approved or SubmissionStatus.Rejected or SubmissionStatus.Completed)
        {
            throw new SubmissionInvalidOperationException($"Cannot review a submission in '{Status}' state.");
        }

        RecordAudit("ReviewStarted", performedBy, null, SubmissionStatus.UnderReview);
        Status = SubmissionStatus.UnderReview;
        SetUpdateAudit(Guid.TryParse(performedBy, out var id) ? id : null, DateTime.UtcNow);
    }

    public void Approve(string? note, string? performedBy = null)
    {
        if (Status is SubmissionStatus.Rejected or SubmissionStatus.Completed)
        {
            throw new SubmissionInvalidOperationException($"Cannot approve a submission in '{Status}' state.");
        }

        ReviewNote = note?.Trim() switch { "" => null, var v => v };
        RecordAudit("Approved", performedBy, ReviewNote, SubmissionStatus.Approved);
        Status = SubmissionStatus.Approved;
        SetUpdateAudit(Guid.TryParse(performedBy, out var id) ? id : null, DateTime.UtcNow);
        AddDomainEvent(new SubmissionApprovedEvent(Id, FormId));
    }

    public void Reject(string? note, string? performedBy = null)
    {
        if (Status is SubmissionStatus.Approved or SubmissionStatus.Completed)
        {
            throw new SubmissionInvalidOperationException($"Cannot reject a submission in '{Status}' state.");
        }

        ReviewNote = note?.Trim() switch { "" => null, var v => v };
        RecordAudit("Rejected", performedBy, ReviewNote, SubmissionStatus.Rejected);
        Status = SubmissionStatus.Rejected;
        SetUpdateAudit(Guid.TryParse(performedBy, out var id) ? id : null, DateTime.UtcNow);
        AddDomainEvent(new SubmissionRejectedEvent(Id, FormId));
    }

    public void Escalate(string? note, string? performedBy = null)
    {
        if (Status is SubmissionStatus.Approved or SubmissionStatus.Rejected or SubmissionStatus.Completed)
        {
            throw new SubmissionInvalidOperationException($"Cannot escalate a submission in '{Status}' state.");
        }

        RecordAudit("Escalated", performedBy, note, SubmissionStatus.Escalated);
        Status = SubmissionStatus.Escalated;
        SetUpdateAudit(Guid.TryParse(performedBy, out var id) ? id : null, DateTime.UtcNow);
    }

    public void Complete(string? performedBy = null)
    {
        if (Status is SubmissionStatus.Rejected)
        {
            throw new SubmissionInvalidOperationException($"Cannot complete a rejected submission.");
        }

        RecordAudit("Completed", performedBy, null, SubmissionStatus.Completed);
        Status = SubmissionStatus.Completed;
        SetUpdateAudit(Guid.TryParse(performedBy, out var id) ? id : null, DateTime.UtcNow);
    }

    public void MarkSpam(string? performedBy = null)
    {
        RecordAudit("MarkedSpam", performedBy, null, SubmissionStatus.Spam);
        Status = SubmissionStatus.Spam;
        SetUpdateAudit(Guid.TryParse(performedBy, out var id) ? id : null, DateTime.UtcNow);
    }

    public void AddAttachment(string fileName, string storedAssetId, string? contentType = null, long size = 0, string? url = null)
    {
        Attachments.Add(SubmissionAttachment.Create(Id, fileName, storedAssetId, contentType, size, url));
    }

    public IDictionary<string, object?> GetData() =>
        JsonSerializer.Deserialize<Dictionary<string, object?>>(Data) ?? new Dictionary<string, object?>();

    private void RecordAudit(string action, string? performedBy, string? note, SubmissionStatus resultingStatus)
    {
        Audit.Add(SubmissionAudit.Create(
            Id,
            action,
            performedBy,
            note,
            resultingStatus,
            DateTime.UtcNow));
    }
}

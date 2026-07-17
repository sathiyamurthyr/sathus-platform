namespace Sathus.Forms.Domain.Enums;

/// <summary>Review/processing status of a submitted form response.</summary>
public enum SubmissionStatus
{
    Submitted = 0,
    UnderReview = 1,
    Approved = 2,
    Rejected = 3,
    Escalated = 4,
    Assigned = 5,
    Completed = 6,
    Spam = 7
}

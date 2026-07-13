namespace Sathus.Forms.Domain.Enums;

/// <summary>Type of a workflow step in the workflow engine.</summary>
public enum WorkflowStepType
{
    Start = 0,
    Review = 1,
    Approval = 2,
    Assignment = 3,
    Condition = 4,
    Notification = 5,
    Automation = 6,
    End = 7
}

/// <summary>Automation / processing behaviour triggered by a workflow action.</summary>
public enum WorkflowActionType
{
    SendEmail = 0,
    SendWebhook = 1,
    SendApiCallback = 2,
    CreateTask = 3,
    NotifyInternal = 4,
    Approve = 5,
    Reject = 6,
    Assign = 7,
    Escalate = 8,
    Complete = 9
}

/// <summary>Outcome of an approval decision on a submission.</summary>
public enum ApprovalDecision
{
    Pending = 0,
    Approved = 1,
    Rejected = 2
}

using System.Collections.Generic;

namespace Sathus.Forms.Application.Workflow;

/// <summary>An intent to dispatch a notification through a configured channel.</summary>
public sealed record NotificationIntent(
    string Channel,
    string Recipient,
    string? Template,
    string Payload);

/// <summary>An intent to execute an automation action (webhook, api callback, task, etc.).</summary>
public sealed record ActionIntent(string Type, IReadOnlyDictionary<string, object?>? Config);

/// <summary>The outcome of running a workflow against a submission.</summary>
public sealed class WorkflowExecutionResult
{
    public IReadOnlyList<NotificationIntent> Notifications => _notifications;
    public IReadOnlyList<ActionIntent> Actions => _actions;
    public IReadOnlyList<string> ApprovalRoles => _approvalRoles;

    public string? AssignedTo { get; set; }
    public string? SuggestedStatus { get; set; }

    private readonly List<NotificationIntent> _notifications = new();
    private readonly List<ActionIntent> _actions = new();
    private readonly List<string> _approvalRoles = new();

    public void AddNotification(NotificationIntent intent) => _notifications.Add(intent);

    public void AddAction(ActionIntent intent) => _actions.Add(intent);

    public void AddApprovalRole(string role) => _approvalRoles.Add(role);
}

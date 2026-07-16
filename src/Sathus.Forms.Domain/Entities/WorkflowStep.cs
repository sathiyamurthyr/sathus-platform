using System.Text.Json;
using Sathus.Forms.Domain.Enums;

namespace Sathus.Forms.Domain.Entities;

/// <summary>A step within a workflow. Owns its actions, approval rules and notification rules.</summary>
public sealed class WorkflowStep : Entity
{
    public Guid WorkflowId { get; private set; }

    public string Name { get; private set; } = string.Empty;

    public WorkflowStepType Type { get; private set; }

    public int Order { get; private set; }

    public string? ConfigJson { get; private set; }

    public ICollection<WorkflowAction> Actions { get; } = new List<WorkflowAction>();

    public ICollection<ApprovalRule> ApprovalRules { get; } = new List<ApprovalRule>();

    public ICollection<NotificationRule> NotificationRules { get; } = new List<NotificationRule>();

    private WorkflowStep()
    {
    }

    public static WorkflowStep Create(
        Guid workflowId,
        string name,
        WorkflowStepType type,
        int order,
        IDictionary<string, object?>? config = null,
        Guid? createdBy = null) =>
        new()
        {
            Id = Guid.NewGuid(),
            WorkflowId = workflowId,
            Name = (name ?? type.ToString()).Trim(),
            Type = type,
            Order = order,
            ConfigJson = config is null ? null : JsonSerializer.Serialize(config),
            CreatedBy = createdBy,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

    public void SetOrder(int order) => Order = order;

    public IDictionary<string, object?>? GetConfig() =>
        string.IsNullOrWhiteSpace(ConfigJson)
            ? null
            : JsonSerializer.Deserialize<Dictionary<string, object?>>(ConfigJson);

    public void SetConfig(IDictionary<string, object?> config, Guid? updatedBy = null)
    {
        ConfigJson = JsonSerializer.Serialize(config);
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    public void AddAction(WorkflowActionType type, IDictionary<string, object?>? config = null, Guid? createdBy = null)
    {
        var order = Actions.Count == 0 ? 0 : Actions.Max(a => a.Order) + 1;
        Actions.Add(WorkflowAction.Create(Id, type, order, config, createdBy));
        SetUpdateAudit(createdBy, DateTime.UtcNow);
    }

    public void RemoveAction(Guid actionId)
    {
        var action = Actions.FirstOrDefault(a => a.Id == actionId);
        if (action is not null)
        {
            Actions.Remove(action);
        }
    }

    public void AddApprovalRule(string role, string? conditionJson = null, int order = 0, Guid? createdBy = null)
    {
        ApprovalRules.Add(ApprovalRule.Create(Id, role, conditionJson, order, createdBy));
    }

    public void AddNotificationRule(NotificationChannel channel, string recipient, string? template = null, string? conditionJson = null, Guid? createdBy = null)
    {
        NotificationRules.Add(NotificationRule.Create(Id, channel, recipient, template, conditionJson, createdBy));
    }
}

using System.Text.Json;
using Sathus.Forms.Domain.Enums;
using Sathus.Forms.Domain.Events;

namespace Sathus.Forms.Domain.Entities;

/// <summary>
/// A no-code workflow attached to a form. Orchestrates review, approval, assignment, escalation
/// and automation steps that run against each submission. Distinct aggregate from <see cref="Form"/>.
/// </summary>
public sealed class Workflow : AggregateRoot
{
    public Guid FormId { get; private set; }

    public string Name { get; private set; } = string.Empty;

    public bool IsEnabled { get; private set; } = true;

    public bool TriggerOnSubmit { get; private set; } = true;

    public ICollection<WorkflowStep> Steps { get; } = new List<WorkflowStep>();

    private Workflow()
    {
    }

    public static Workflow Create(Guid formId, string name, bool triggerOnSubmit = true, Guid? createdBy = null) =>
        new()
        {
            Id = Guid.NewGuid(),
            FormId = formId,
            Name = (name ?? "Default Workflow").Trim(),
            IsEnabled = true,
            TriggerOnSubmit = triggerOnSubmit,
            CreatedBy = createdBy,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

    public void Rename(string name, Guid? updatedBy)
    {
        Name = (name ?? string.Empty).Trim();
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    public void Enable(Guid? updatedBy)
    {
        IsEnabled = true;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    public void Disable(Guid? updatedBy)
    {
        IsEnabled = false;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
        AddDomainEvent(new WorkflowDisabledEvent(Id, FormId));
    }

    public WorkflowStep AddStep(string name, WorkflowStepType type, int order, IDictionary<string, object?>? config = null, Guid? createdBy = null)
    {
        var step = WorkflowStep.Create(Id, name, type, order, config, createdBy);
        Steps.Add(step);
        SetUpdateAudit(createdBy, DateTime.UtcNow);
        AddDomainEvent(new WorkflowStepCreatedEvent(Id, step.Id));
        return step;
    }

    public void RemoveStep(Guid stepId, Guid? updatedBy)
    {
        var step = Steps.FirstOrDefault(s => s.Id == stepId) ?? throw new WorkflowStepNotFoundException(stepId);
        Steps.Remove(step);
        Reindex();
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    public void ReorderStep(Guid stepId, int newOrder, Guid? updatedBy)
    {
        var step = Steps.FirstOrDefault(s => s.Id == stepId) ?? throw new WorkflowStepNotFoundException(stepId);
        step.SetOrder(newOrder);
        Reindex();
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    public void AddAction(Guid stepId, WorkflowActionType type, IDictionary<string, object?>? config = null, Guid? createdBy = null)
    {
        var step = Steps.FirstOrDefault(s => s.Id == stepId) ?? throw new WorkflowStepNotFoundException(stepId);
        step.AddAction(type, config, createdBy);
        SetUpdateAudit(createdBy, DateTime.UtcNow);
    }

    public void RemoveAction(Guid stepId, Guid actionId, Guid? updatedBy)
    {
        var step = Steps.FirstOrDefault(s => s.Id == stepId) ?? throw new WorkflowStepNotFoundException(stepId);
        step.RemoveAction(actionId);
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    public void AddApprovalRule(Guid stepId, string role, string? conditionJson = null, int order = 0, Guid? createdBy = null)
    {
        var step = Steps.FirstOrDefault(s => s.Id == stepId) ?? throw new WorkflowStepNotFoundException(stepId);
        step.AddApprovalRule(role, conditionJson, order, createdBy);
        SetUpdateAudit(createdBy, DateTime.UtcNow);
    }

    public void AddNotificationRule(Guid stepId, NotificationChannel channel, string recipient, string? template = null, string? conditionJson = null, Guid? createdBy = null)
    {
        var step = Steps.FirstOrDefault(s => s.Id == stepId) ?? throw new WorkflowStepNotFoundException(stepId);
        step.AddNotificationRule(channel, recipient, template, conditionJson, createdBy);
        SetUpdateAudit(createdBy, DateTime.UtcNow);
    }

    public void Reindex()
    {
        var ordered = Steps.OrderBy(s => s.Order).ToList();
        for (var i = 0; i < ordered.Count; i++)
        {
            ordered[i].SetOrder(i);
        }
    }
}

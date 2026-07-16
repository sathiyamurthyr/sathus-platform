using System.Text.Json;
using Sathus.Forms.Domain.Enums;

namespace Sathus.Forms.Domain.Entities;

/// <summary>An automation/processing action executed when a workflow step runs.</summary>
public sealed class WorkflowAction : Entity
{
    public Guid StepId { get; private set; }

    public WorkflowActionType Type { get; private set; }

    public int Order { get; private set; }

    public string? ConfigJson { get; private set; }

    private WorkflowAction()
    {
    }

    public static WorkflowAction Create(
        Guid stepId,
        WorkflowActionType type,
        int order,
        IDictionary<string, object?>? config = null,
        Guid? createdBy = null) =>
        new()
        {
            Id = Guid.NewGuid(),
            StepId = stepId,
            Type = type,
            Order = order,
            ConfigJson = config is null ? null : JsonSerializer.Serialize(config),
            CreatedBy = createdBy,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

    public IDictionary<string, object?>? GetConfig() =>
        string.IsNullOrWhiteSpace(ConfigJson)
            ? null
            : JsonSerializer.Deserialize<Dictionary<string, object?>>(ConfigJson);
}

namespace Sathus.Forms.Domain.Entities;

/// <summary>A rule that requires a specific role/permission to approve a submission at a step.</summary>
public sealed class ApprovalRule : Entity
{
    public Guid StepId { get; private set; }

    public string Role { get; private set; } = string.Empty;

    public int Order { get; private set; }

    public string? ConditionJson { get; private set; }

    private ApprovalRule()
    {
    }

    public static ApprovalRule Create(Guid stepId, string role, string? conditionJson = null, int order = 0, Guid? createdBy = null) =>
        new()
        {
            Id = Guid.NewGuid(),
            StepId = stepId,
            Role = (role ?? string.Empty).Trim(),
            Order = order,
            ConditionJson = conditionJson,
            CreatedBy = createdBy,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
}

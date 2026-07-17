using System.Text.Json;
using Sathus.Forms.Domain.Enums;

namespace Sathus.Forms.Domain.Entities;

/// <summary>
/// A single input in a form section. Owns its <see cref="FieldOption"/> list (for choice
/// fields) and <see cref="ValidationRule"/> list. Conditional visibility is stored as a
/// serialized <see cref="VisibilityCondition"/> because its shape is dynamic.
/// </summary>
public sealed class FormField : Entity
{
    public Guid SectionId { get; internal set; }

    public string Key { get; private set; } = string.Empty;

    public string Label { get; private set; } = string.Empty;

    public FieldType Type { get; private set; }

    public string? Placeholder { get; private set; }

    public string? HelpText { get; private set; }

    public string? DefaultValue { get; private set; }

    public bool IsRequired { get; private set; }

    public int Order { get; private set; }

    public int Width { get; private set; } = 12;

    public ReferenceKind ReferenceKind { get; private set; } = ReferenceKind.None;

    public Guid? ReferenceId { get; private set; }

    public string? VisibilityConditionJson { get; private set; }

    public ICollection<FieldOption> Options { get; } = new List<FieldOption>();

    public ICollection<ValidationRule> ValidationRules { get; } = new List<ValidationRule>();

    private FormField()
    {
    }

    public static FormField Create(
        Guid sectionId,
        string key,
        string label,
        FieldType type,
        int order,
        string? placeholder = null,
        string? helpText = null,
        string? defaultValue = null,
        bool isRequired = false,
        int width = 12,
        ReferenceKind referenceKind = ReferenceKind.None,
        Guid? referenceId = null,
        Guid? createdBy = null)
    {
        if (string.IsNullOrWhiteSpace(key))
        {
            throw new ArgumentException("Field key is required.", nameof(key));
        }

        if (string.IsNullOrWhiteSpace(label))
        {
            throw new ArgumentException("Field label is required.", nameof(label));
        }

        return new FormField
        {
            Id = Guid.NewGuid(),
            SectionId = sectionId,
            Key = key.Trim(),
            Label = label.Trim(),
            Type = type,
            Placeholder = placeholder?.Trim() switch { "" => null, var v => v },
            HelpText = helpText?.Trim() switch { "" => null, var v => v },
            DefaultValue = defaultValue?.Trim() switch { "" => null, var v => v },
            IsRequired = isRequired,
            Order = order,
            Width = width is > 0 and <= 12 ? width : 12,
            ReferenceKind = referenceKind,
            ReferenceId = referenceId,
            CreatedBy = createdBy,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public void Update(
        string label,
        FieldType type,
        string? placeholder,
        string? helpText,
        string? defaultValue,
        bool isRequired,
        int width,
        ReferenceKind referenceKind,
        Guid? referenceId,
        Guid? updatedBy)
    {
        Label = (label ?? string.Empty).Trim();
        Type = type;
        Placeholder = placeholder?.Trim() switch { "" => null, var v => v };
        HelpText = helpText?.Trim() switch { "" => null, var v => v };
        DefaultValue = defaultValue?.Trim() switch { "" => null, var v => v };
        IsRequired = isRequired;
        Width = width is > 0 and <= 12 ? width : 12;
        ReferenceKind = referenceKind;
        ReferenceId = referenceId;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    public void SetOrder(int order) => Order = order;

    public void SetVisibilityCondition(VisibilityCondition? condition, Guid? updatedBy)
    {
        VisibilityConditionJson = condition is null ? null : JsonSerializer.Serialize(condition);
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    public VisibilityCondition? GetVisibilityCondition() =>
        string.IsNullOrWhiteSpace(VisibilityConditionJson)
            ? null
            : JsonSerializer.Deserialize<VisibilityCondition>(VisibilityConditionJson);

    public void AddOption(string value, string label, int order, Guid? createdBy = null)
    {
        Options.Add(FieldOption.Create(Id, value, label, order, createdBy));
    }

    public void RemoveOption(Guid optionId)
    {
        var option = Options.FirstOrDefault(o => o.Id == optionId);
        if (option is not null)
        {
            Options.Remove(option);
        }
    }

    public void AddValidationRule(ValidationRuleType type, string? value, string? message, Guid? createdBy = null)
    {
        ValidationRules.Add(ValidationRule.Create(Id, type, value, message, createdBy));
    }

    public void RemoveValidationRule(Guid ruleId)
    {
        var rule = ValidationRules.FirstOrDefault(r => r.Id == ruleId);
        if (rule is not null)
        {
            ValidationRules.Remove(rule);
        }
    }
}

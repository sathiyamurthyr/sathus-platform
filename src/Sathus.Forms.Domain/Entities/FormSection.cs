using System.Text.Json;
using Sathus.Forms.Domain.Enums;
using Sathus.Forms.Domain.ValueObjects;

namespace Sathus.Forms.Domain.Entities;

/// <summary>A logical grouping of fields within a form (tab / fieldset).</summary>
public sealed class FormSection : Entity
{
    public Guid FormId { get; private set; }

    public string Key { get; private set; } = string.Empty;

    public string Title { get; private set; } = string.Empty;

    public string? Description { get; private set; }

    public int Order { get; private set; }

    public bool Collapsible { get; private set; }

    public bool IsVisible { get; private set; } = true;

    public string? VisibilityConditionJson { get; private set; }

    public ICollection<FormField> Fields { get; } = new List<FormField>();

    private FormSection()
    {
    }

    public static FormSection Create(
        Guid formId,
        string key,
        string title,
        int order,
        string? description = null,
        bool collapsible = false,
        Guid? createdBy = null)
    {
        if (string.IsNullOrWhiteSpace(key))
        {
            throw new ArgumentException("Section key is required.", nameof(key));
        }

        if (string.IsNullOrWhiteSpace(title))
        {
            throw new ArgumentException("Section title is required.", nameof(title));
        }

        return new FormSection
        {
            Id = Guid.NewGuid(),
            FormId = formId,
            Key = key.Trim(),
            Title = title.Trim(),
            Description = description?.Trim() switch { "" => null, var v => v },
            Order = order,
            Collapsible = collapsible,
            IsVisible = true,
            CreatedBy = createdBy,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public void Update(string title, string? description, bool collapsible, Guid? updatedBy)
    {
        Title = (title ?? string.Empty).Trim();
        Description = description?.Trim() switch { "" => null, var v => v };
        Collapsible = collapsible;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    public void SetOrder(int order) => Order = order;

    public void SetVisibility(bool visible) => IsVisible = visible;

    public void SetVisibilityCondition(VisibilityCondition? condition, Guid? updatedBy)
    {
        VisibilityConditionJson = condition is null ? null : JsonSerializer.Serialize(condition);
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    public VisibilityCondition? GetVisibilityCondition() =>
        string.IsNullOrWhiteSpace(VisibilityConditionJson)
            ? null
            : JsonSerializer.Deserialize<VisibilityCondition>(VisibilityConditionJson);

    public FormField AddField(
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
        var field = FormField.Create(Id, key, label, type, order, placeholder, helpText,
            defaultValue, isRequired, width, referenceKind, referenceId, createdBy);
        Fields.Add(field);
        return field;
    }
}

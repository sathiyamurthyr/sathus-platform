namespace Sathus.Forms.Domain.Entities;

/// <summary>A selectable option for choice fields (Radio, Dropdown, MultiSelect).</summary>
public sealed class FieldOption : Entity
{
    public Guid FieldId { get; private set; }

    public string Value { get; private set; } = string.Empty;

    public string Label { get; private set; } = string.Empty;

    public int Order { get; private set; }

    private FieldOption()
    {
    }

    public static FieldOption Create(Guid fieldId, string value, string label, int order, Guid? createdBy = null) =>
        new()
        {
            Id = Guid.NewGuid(),
            FieldId = fieldId,
            Value = (value ?? string.Empty).Trim(),
            Label = (label ?? value ?? string.Empty).Trim(),
            Order = order,
            CreatedBy = createdBy,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
}

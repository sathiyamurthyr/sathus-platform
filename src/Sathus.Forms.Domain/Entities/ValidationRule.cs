using Sathus.Forms.Domain.Enums;

namespace Sathus.Forms.Domain.Entities;

/// <summary>A validation constraint attached to a <see cref="FormField"/>.</summary>
public sealed class ValidationRule : Entity
{
    public Guid FieldId { get; private set; }

    public ValidationRuleType Type { get; private set; }

    public string? Value { get; private set; }

    public string? Message { get; private set; }

    private ValidationRule()
    {
    }

    public static ValidationRule Create(
        Guid fieldId,
        ValidationRuleType type,
        string? value,
        string? message,
        Guid? createdBy = null)
    {
        if (type is ValidationRuleType.Required or ValidationRuleType.Email or ValidationRuleType.Url)
        {
            value = null;
        }

        return new ValidationRule
        {
            Id = Guid.NewGuid(),
            FieldId = fieldId,
            Type = type,
            Value = value?.Trim() switch { "" => null, var v => v },
            Message = message?.Trim() switch { "" => null, var v => v },
            CreatedBy = createdBy,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }
}

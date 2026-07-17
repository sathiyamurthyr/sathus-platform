namespace Sathus.Navigation.Domain.ValueObjects;

/// <summary>
/// Localizable display name for a node or menu. Never empty and bounded in length.
/// </summary>
public sealed record DisplayName
{
    public string Value { get; }

    public const int MaxLength = 256;

    private DisplayName(string value) => Value = value;

    public static DisplayName Create(string? raw)
    {
        if (string.IsNullOrWhiteSpace(raw))
        {
            throw new ArgumentException("Display name is required.", nameof(raw));
        }

        var trimmed = raw.Trim();
        if (trimmed.Length > MaxLength)
        {
            throw new ArgumentException($"Display name must be at most {MaxLength} characters.", nameof(raw));
        }

        return new DisplayName(trimmed);
    }

    public override string ToString() => Value;
}

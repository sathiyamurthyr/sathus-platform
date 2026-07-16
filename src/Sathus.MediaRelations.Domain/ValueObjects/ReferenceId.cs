namespace Sathus.MediaRelations.Domain.ValueObjects;

/// <summary>
/// Strongly-typed identifier of a piece of source content that references an asset
/// (for example a page id, product SKU, blog slug or navigation node id).
/// The value is opaque so no module-specific format is assumed.
/// </summary>
public sealed record ReferenceId
{
    public string Value { get; set; } = string.Empty;

    public const int MaxLength = 256;

    public ReferenceId()
    {
    }

    private ReferenceId(string value) => Value = value;

    public static ReferenceId Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("Reference id is required.", nameof(value));
        }

        var trimmed = value.Trim();
        if (trimmed.Length > MaxLength)
        {
            throw new ArgumentException($"Reference id must be at most {MaxLength} characters.", nameof(value));
        }

        return new ReferenceId(trimmed);
    }

    public override string ToString() => Value;
}

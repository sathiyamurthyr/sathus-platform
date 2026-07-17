namespace Sathus.MediaRelations.Domain.ValueObjects;

/// <summary>
/// The precise location of a reference inside the source content, expressed as a
/// dotted/bracketed path (for example "body.blocks[2].image" or "seo.ogImage").
/// Enables pinpointing and de-duplicating references within a single content item.
/// </summary>
public sealed record ReferencePath
{
    public string Value { get; set; } = string.Empty;

    public const int MaxLength = 1024;

    public static readonly ReferencePath Root = new("$");

    public ReferencePath()
    {
    }

    private ReferencePath(string value) => Value = value;

    public static ReferencePath Create(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return new ReferencePath(Root.Value);
        }

        var trimmed = value.Trim();
        if (trimmed.Length > MaxLength)
        {
            throw new ArgumentException($"Reference path must be at most {MaxLength} characters.", nameof(value));
        }

        return new ReferencePath(trimmed);
    }

    public bool IsRoot => Value == Root.Value;

    /// <summary>Depth of the path measured by dot separators (root = 0).</summary>
    public int Depth => IsRoot ? 0 : Value.Count(c => c == '.') + 1;

    public override string ToString() => Value;
}

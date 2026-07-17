namespace Sathus.MediaRelations.Domain.ValueObjects;

/// <summary>
/// The lifecycle scope of the content that holds a reference. Drives safe-delete
/// decisions (published/scheduled references block deletion). Open for future scopes.
/// </summary>
public sealed record ReferenceScope
{
    public string Value { get; set; } = string.Empty;

    public const int MaxLength = 32;

    public const string DraftValue = "draft";
    public const string PublishedValue = "published";
    public const string ScheduledValue = "scheduled";
    public const string ArchivedValue = "archived";

    public static readonly ReferenceScope Draft = new(DraftValue);
    public static readonly ReferenceScope Published = new(PublishedValue);
    public static readonly ReferenceScope Scheduled = new(ScheduledValue);
    public static readonly ReferenceScope Archived = new(ArchivedValue);

    public static IReadOnlyList<ReferenceScope> Supported { get; } = new[]
    {
        Draft, Published, Scheduled, Archived
    };

    public ReferenceScope()
    {
    }

    private ReferenceScope(string value) => Value = value;

    public static ReferenceScope Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("Reference scope is required.", nameof(value));
        }

        return FromName(value);
    }

    public static ReferenceScope FromName(string value)
    {
        var normalized = value.Trim().ToLowerInvariant();
        if (normalized.Length > MaxLength)
        {
            throw new ArgumentException($"Reference scope must be at most {MaxLength} characters.", nameof(value));
        }

        return normalized switch
        {
            DraftValue => new ReferenceScope(normalized),
            PublishedValue => new ReferenceScope(normalized),
            ScheduledValue => new ReferenceScope(normalized),
            ArchivedValue => new ReferenceScope(normalized),
            _ => new ReferenceScope(normalized)
        };
    }

    /// <summary>True when a reference in this scope should be treated as "live" for safe-delete.</summary>
    public bool IsActive => Value is PublishedValue or ScheduledValue;

    public override string ToString() => Value;
}

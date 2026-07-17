namespace Sathus.Upload.Domain.ValueObjects;

public sealed record UploadId
{
    public string Value { get; set; } = string.Empty;
    public const int MaxLength = 128;

    public UploadId()
    {
    }

    private UploadId(string value) => Value = value;

    public static UploadId Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Upload ID is required.", nameof(value));

        var trimmed = value.Trim();
        if (trimmed.Length > MaxLength)
            throw new ArgumentException($"Upload ID must be at most {MaxLength} characters.", nameof(value));

        return new UploadId { Value = trimmed };
    }

    public override string ToString() => Value;
}

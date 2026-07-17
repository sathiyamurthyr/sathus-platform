namespace Sathus.Media.Domain.ValueObjects;

/// <summary>
/// Classification of a media asset. Supports core types plus future extensions.
/// Maps to an EF owned type.
/// </summary>
public sealed record MediaType
{
    public string Value { get; set; } = string.Empty;

    public const string ImageValue = "image";
    public const string VideoValue = "video";
    public const string AudioValue = "audio";
    public const string DocumentValue = "document";
    public const string ArchiveValue = "archive";
    public const string OtherValue = "other";

    public static readonly MediaType Image = new(ImageValue);
    public static readonly MediaType Video = new(VideoValue);
    public static readonly MediaType Audio = new(AudioValue);
    public static readonly MediaType Document = new(DocumentValue);
    public static readonly MediaType Archive = new(ArchiveValue);
    public static readonly MediaType Other = new(OtherValue);

    public static IReadOnlyList<MediaType> Supported { get; } =
        new[] { Image, Video, Audio, Document, Archive, Other };

    public MediaType()
    {
    }

    private MediaType(string value) => Value = value;

    public static MediaType Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("Media type is required.", nameof(value));
        }

        return FromName(value);
    }

    public static MediaType FromName(string value)
    {
        var normalized = value.Trim().ToLowerInvariant();
        return normalized switch
        {
            ImageValue => Image,
            VideoValue => Video,
            AudioValue => Audio,
            DocumentValue => Document,
            ArchiveValue => Archive,
            OtherValue => Other,
            _ => new MediaType { Value = normalized }
        };
    }

    public bool IsKnown => Supported.Any(t => t.Value == Value);

    public override string ToString() => Value;
}

namespace Sathus.MediaRelations.Domain.ValueObjects;

/// <summary>
/// The relationship an asset plays inside the referencing content (featured image,
/// gallery item, attachment, ...). Open for future relationship kinds via <see cref="Create"/>.
/// </summary>
public sealed record UsageType
{
    public string Value { get; set; } = string.Empty;

    public const int MaxLength = 64;

    public const string FeaturedImageValue = "featured-image";
    public const string GalleryValue = "gallery";
    public const string AttachmentValue = "attachment";
    public const string ThumbnailValue = "thumbnail";
    public const string HeroBannerValue = "hero-banner";
    public const string AvatarValue = "avatar";
    public const string BackgroundValue = "background";
    public const string InlineContentValue = "inline-content";
    public const string DownloadValue = "download";
    public const string IconValue = "icon";
    public const string VideoPosterValue = "video-poster";
    public const string LogoValue = "logo";

    public static readonly UsageType FeaturedImage = new(FeaturedImageValue);
    public static readonly UsageType Gallery = new(GalleryValue);
    public static readonly UsageType Attachment = new(AttachmentValue);
    public static readonly UsageType Thumbnail = new(ThumbnailValue);
    public static readonly UsageType HeroBanner = new(HeroBannerValue);
    public static readonly UsageType Avatar = new(AvatarValue);
    public static readonly UsageType Background = new(BackgroundValue);
    public static readonly UsageType InlineContent = new(InlineContentValue);
    public static readonly UsageType Download = new(DownloadValue);
    public static readonly UsageType Icon = new(IconValue);
    public static readonly UsageType VideoPoster = new(VideoPosterValue);
    public static readonly UsageType Logo = new(LogoValue);

    public static IReadOnlyList<UsageType> Supported { get; } = new[]
    {
        FeaturedImage, Gallery, Attachment, Thumbnail, HeroBanner, Avatar,
        Background, InlineContent, Download, Icon, VideoPoster, Logo
    };

    public UsageType()
    {
    }

    private UsageType(string value) => Value = value;

    public static UsageType Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("Usage type is required.", nameof(value));
        }

        return FromName(value);
    }

    public static UsageType FromName(string value)
    {
        var normalized = value.Trim().ToLowerInvariant();
        if (normalized.Length > MaxLength)
        {
            throw new ArgumentException($"Usage type must be at most {MaxLength} characters.", nameof(value));
        }

        return normalized switch
        {
            FeaturedImageValue => new UsageType(normalized),
            GalleryValue => new UsageType(normalized),
            AttachmentValue => new UsageType(normalized),
            ThumbnailValue => new UsageType(normalized),
            HeroBannerValue => new UsageType(normalized),
            AvatarValue => new UsageType(normalized),
            BackgroundValue => new UsageType(normalized),
            InlineContentValue => new UsageType(normalized),
            DownloadValue => new UsageType(normalized),
            IconValue => new UsageType(normalized),
            VideoPosterValue => new UsageType(normalized),
            LogoValue => new UsageType(normalized),
            _ => new UsageType(normalized)
        };
    }

    public bool IsWellKnown => Supported.Any(t => t.Value == Value);

    public override string ToString() => Value;
}

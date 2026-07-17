using System.Collections.ObjectModel;

namespace Sathus.Processing.Domain.ValueObjects;

/// <summary>
/// A derived asset produced during processing (thumbnail, resized image, webp
/// rendition, video poster, blur placeholder, etc.). Backed by the storage provider.
/// </summary>
public sealed record Rendition
{
    public RenditionKind Kind { get; init; }
    public string Format { get; init; } = string.Empty;
    public int? Width { get; init; }
    public int? Height { get; init; }
    public long SizeBytes { get; init; }
    public string StorageKey { get; init; } = string.Empty;
    public string? Url { get; init; }
    public string? Note { get; init; }

    public static Rendition Create(
        RenditionKind kind,
        string format,
        long sizeBytes,
        string storageKey,
        int? width = null,
        int? height = null,
        string? url = null,
        string? note = null) =>
        new()
        {
            Kind = kind,
            Format = format,
            SizeBytes = sizeBytes,
            StorageKey = storageKey,
            Width = width,
            Height = height,
            Url = url,
            Note = note
        };

    public static IReadOnlyList<RenditionKind> ThumbnailKinds { get; } =
        new ReadOnlyCollection<RenditionKind>(new List<RenditionKind>
        {
            RenditionKind.Thumbnail,
            RenditionKind.Small,
            RenditionKind.Medium,
            RenditionKind.Large,
            RenditionKind.Preview,
            RenditionKind.Poster
        });
}

namespace Sathus.Processing.Domain.ValueObjects;

/// <summary>
/// Classification of a generated rendition/derivative produced by a processor.
/// </summary>
public enum RenditionKind
{
    Original,
    Thumbnail,
    Small,
    Medium,
    Large,
    Preview,
    WebP,
    Avif,
    Poster,
    DocumentPreview,
    BlurPlaceholder
}

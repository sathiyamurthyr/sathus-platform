namespace Sathus.Content.Domain.Entities;

public sealed class MediaAsset : BaseEntity
{
    public string Filename { get; private set; } = string.Empty;
    public string OriginalName { get; private set; } = string.Empty;
    public string MimeType { get; private set; } = string.Empty;
    public long Size { get; private set; }
    public string Url { get; private set; } = string.Empty;
    public string? AltText { get; private set; }

    public MediaAsset(string filename, string originalName, string mimeType, long size, string url)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(filename);
        ArgumentException.ThrowIfNullOrWhiteSpace(originalName);
        ArgumentException.ThrowIfNullOrWhiteSpace(mimeType);
        ArgumentException.ThrowIfNullOrWhiteSpace(url);
        if (size <= 0) throw new ArgumentOutOfRangeException(nameof(size));

        Id = Guid.NewGuid();
        Filename = filename;
        OriginalName = originalName;
        MimeType = mimeType;
        Size = size;
        Url = url;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateAltText(string? altText)
    {
        AltText = altText;
        UpdatedAt = DateTime.UtcNow;
    }
}

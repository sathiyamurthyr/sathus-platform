namespace Sathus.Forms.Domain.Entities;

/// <summary>A file attached to a submission. Reuses the Enterprise DAM via <see cref="StoredAssetId"/>.</summary>
public sealed class SubmissionAttachment : Entity
{
    public Guid SubmissionId { get; private set; }

    public string FileName { get; private set; } = string.Empty;

    public string StoredAssetId { get; private set; } = string.Empty;

    public string? ContentType { get; private set; }

    public long Size { get; private set; }

    public string? Url { get; private set; }

    private SubmissionAttachment()
    {
    }

    public static SubmissionAttachment Create(
        Guid submissionId,
        string fileName,
        string storedAssetId,
        string? contentType = null,
        long size = 0,
        string? url = null) =>
        new()
        {
            Id = Guid.NewGuid(),
            SubmissionId = submissionId,
            FileName = (fileName ?? "file").Trim(),
            StoredAssetId = (storedAssetId ?? string.Empty).Trim(),
            ContentType = contentType,
            Size = size,
            Url = url,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
}

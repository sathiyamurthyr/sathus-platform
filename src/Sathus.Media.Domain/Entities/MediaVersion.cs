using Sathus.Media.Domain.ValueObjects;
using Sathus.SharedKernel.Entities;

namespace Sathus.Media.Domain.Entities;

/// <summary>
/// An immutable revision of an asset's binary content.
/// </summary>
public sealed class MediaVersion : Entity
{
    public Guid AssetId { get; private set; }
    public int VersionNumber { get; private set; }
    public FileName FileName { get; private set; } = null!;
    public FileExtension FileExtension { get; private set; } = null!;
    public MimeType MimeType { get; private set; } = null!;
    public FileSize Size { get; private set; } = null!;
    public Checksum Checksum { get; private set; } = null!;
    public StorageKey StorageKey { get; private set; } = null!;
    public string? Note { get; private set; }
    public Guid? UploadedBy { get; private set; }

    public MediaAsset? Asset { get; set; }

    private MediaVersion()
    {
    }

    public MediaVersion(
        Guid assetId,
        int versionNumber,
        FileName fileName,
        FileExtension fileExtension,
        MimeType mimeType,
        FileSize size,
        Checksum checksum,
        StorageKey storageKey,
        Guid? createdBy = null,
        string? note = null)
    {
        if (versionNumber <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(versionNumber), "Version number must be greater than zero.");
        }

        Id = Guid.NewGuid();
        AssetId = assetId;
        VersionNumber = versionNumber;
        FileName = fileName;
        FileExtension = fileExtension;
        MimeType = mimeType;
        Size = size;
        Checksum = checksum;
        StorageKey = storageKey;
        UploadedBy = createdBy;
        Note = note;
        SetCreationAudit(createdBy, DateTime.UtcNow);
    }
}

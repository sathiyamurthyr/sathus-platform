using Sathus.Media.Domain.ValueObjects;
using Sathus.SharedKernel.Entities;

namespace Sathus.Media.Domain.Entities;

/// <summary>
/// Records a single place where an asset is consumed across a Sathus product surface.
/// </summary>
public sealed class MediaUsage : Entity
{
    public Guid AssetId { get; private set; }
    public string Context { get; private set; } = string.Empty;
    public string ReferenceType { get; private set; } = string.Empty;
    public string ReferenceId { get; private set; } = string.Empty;
    public string? Url { get; private set; }
    public string? Title { get; private set; }
    public Guid? RecordedBy { get; private set; }

    public MediaAsset? Asset { get; set; }

    private MediaUsage()
    {
    }

    public MediaUsage(
        Guid assetId,
        UsageContext context,
        string referenceType,
        string referenceId,
        string? url = null,
        string? title = null,
        Guid? recordedBy = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(referenceType);
        ArgumentException.ThrowIfNullOrWhiteSpace(referenceId);

        Id = Guid.NewGuid();
        AssetId = assetId;
        Context = context.Value;
        ReferenceType = referenceType.Trim();
        ReferenceId = referenceId.Trim();
        Url = url;
        Title = title;
        RecordedBy = recordedBy;
        SetCreationAudit(recordedBy, DateTime.UtcNow);
    }

    public void UpdatePlacement(string? url, string? title, Guid? updatedBy)
    {
        Url = url;
        Title = title;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }
}

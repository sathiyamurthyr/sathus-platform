using Sathus.Media.Domain.Enums;
using Sathus.SharedKernel.Entities;

namespace Sathus.Media.Domain.Entities;

/// <summary>
/// Shares an asset with a user or via a time-limited link.
/// </summary>
public sealed class MediaShare : Entity
{
    public Guid AssetId { get; private set; }
    public ShareType ShareType { get; private set; }
    public string SharedWith { get; private set; } = string.Empty;
    public AccessLevel AccessLevel { get; private set; }
    public string? Token { get; private set; }
    public DateTime? ExpiresAt { get; private set; }
    public bool IsRevoked { get; private set; }
    public Guid? SharedBy { get; private set; }

    public MediaAsset? Asset { get; set; }

    private MediaShare()
    {
    }

    public MediaShare(
        Guid assetId,
        ShareType shareType,
        string sharedWith,
        AccessLevel accessLevel,
        Guid? createdBy = null,
        string? token = null,
        DateTime? expiresAt = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sharedWith);

        Id = Guid.NewGuid();
        AssetId = assetId;
        ShareType = shareType;
        SharedWith = sharedWith.Trim();
        AccessLevel = accessLevel;
        Token = token;
        ExpiresAt = expiresAt;
        SharedBy = createdBy;
        SetCreationAudit(createdBy, DateTime.UtcNow);
    }

    public void Revoke(Guid? updatedBy)
    {
        IsRevoked = true;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    public bool IsExpired(DateTime now) => ExpiresAt is not null && ExpiresAt <= now;
}

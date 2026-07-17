using Sathus.Media.Domain.Enums;
using Sathus.SharedKernel.Entities;

namespace Sathus.Media.Domain.Entities;

/// <summary>
/// Grants a principal (user or role) a permission on an asset, folder, or tenant scope.
/// </summary>
public sealed class MediaPermission : Entity
{
    public Guid? AssetId { get; private set; }
    public Guid? FolderId { get; private set; }
    public Guid? TenantId { get; private set; }
    public Guid PrincipalId { get; private set; }
    public PrincipalType PrincipalType { get; private set; }
    public string Permission { get; private set; } = string.Empty;
    public Guid? GrantedBy { get; private set; }
    public DateTime? ExpiresAt { get; private set; }

    private MediaPermission()
    {
    }

    public MediaPermission(
        Guid principalId,
        PrincipalType principalType,
        string permission,
        Guid? assetId = null,
        Guid? folderId = null,
        Guid? tenantId = null,
        Guid? grantedBy = null,
        DateTime? expiresAt = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(permission);
        if (assetId is null && folderId is null && tenantId is null)
        {
            throw new ArgumentException("A permission must target an asset, folder, or tenant.", nameof(assetId));
        }

        Id = Guid.NewGuid();
        PrincipalId = principalId;
        PrincipalType = principalType;
        Permission = permission.Trim();
        AssetId = assetId;
        FolderId = folderId;
        TenantId = tenantId;
        GrantedBy = grantedBy;
        ExpiresAt = expiresAt;
        SetCreationAudit(grantedBy, DateTime.UtcNow);
    }

    public bool IsEffective(DateTime now) => ExpiresAt is null || ExpiresAt > now;

    public void Revoke(Guid? updatedBy)
    {
        ExpiresAt = DateTime.UtcNow;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }
}

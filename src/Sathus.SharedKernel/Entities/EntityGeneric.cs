namespace Sathus.SharedKernel.Entities;

public abstract class Entity<TId> where TId : notnull
{
    public TId Id { get; protected set; }
    public DateTime CreatedAt { get; protected set; }
    public DateTime UpdatedAt { get; protected set; }
    public Guid? CreatedBy { get; protected set; }
    public Guid? UpdatedBy { get; protected set; }
    public bool IsDeleted { get; protected set; }
    public DateTime? DeletedAt { get; protected set; }
    public Guid? DeletedBy { get; protected set; }
    public byte[]? RowVersion { get; protected set; }

    protected Entity()
    {
    }

    protected Entity(TId id)
    {
        Id = id;
    }

    public void SetCreationAudit(Guid? createdBy, DateTime now)
    {
        CreatedAt = now;
        UpdatedAt = now;
        CreatedBy = createdBy;
        UpdatedBy = createdBy;
    }

    public void SetUpdateAudit(Guid? updatedBy, DateTime now)
    {
        UpdatedAt = now;
        UpdatedBy = updatedBy;
    }

    public void MarkDeleted(Guid? deletedBy, DateTime now)
    {
        IsDeleted = true;
        DeletedAt = now;
        DeletedBy = deletedBy;
        UpdatedAt = now;
        UpdatedBy = deletedBy;
    }

    public void Restore(Guid? restoredBy, DateTime now)
    {
        IsDeleted = false;
        DeletedAt = null;
        DeletedBy = null;
        UpdatedAt = now;
        UpdatedBy = restoredBy;
    }
}

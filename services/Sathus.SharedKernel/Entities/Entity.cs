namespace Sathus.SharedKernel.Entities;

/// <summary>
/// Base class for all persisted entities. Provides UUID primary key, audit fields,
/// optimistic-concurrency row version and soft-delete support shared across bounded contexts.
/// </summary>
public abstract class Entity
{
    public Guid Id { get; protected set; }
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

    protected Entity(Guid id)
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

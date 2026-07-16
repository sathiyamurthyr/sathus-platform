namespace Sathus.MediaRelations.Domain.Enums;

/// <summary>
/// Lifecycle state of a <see cref="Entities.MediaReference"/>.
/// </summary>
public enum ReferenceStatus
{
    /// <summary>The reference is live and points at an existing asset.</summary>
    Active = 0,

    /// <summary>The reference points at an asset that no longer exists or failed validation.</summary>
    Broken = 1,

    /// <summary>The reference was removed (soft) but retained for history/restore.</summary>
    Removed = 2
}

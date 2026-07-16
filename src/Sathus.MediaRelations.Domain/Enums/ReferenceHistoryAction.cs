namespace Sathus.MediaRelations.Domain.Enums;

/// <summary>
/// The action captured by a <see cref="Entities.MediaReferenceHistory"/> entry.
/// </summary>
public enum ReferenceHistoryAction
{
    Created = 0,
    Updated = 1,
    Removed = 2,
    Restored = 3,
    Broken = 4,
    Validated = 5,
    ScopeChanged = 6
}

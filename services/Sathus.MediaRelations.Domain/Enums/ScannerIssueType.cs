namespace Sathus.MediaRelations.Domain.Enums;

/// <summary>
/// Categories of anomalies the reference scanner can detect.
/// </summary>
public enum ScannerIssueType
{
    /// <summary>An active reference points at an asset that no longer exists.</summary>
    BrokenReference = 0,

    /// <summary>A referenced asset id cannot be resolved in the asset store.</summary>
    MissingAsset = 1,

    /// <summary>An asset exists but has no references at all.</summary>
    OrphanAsset = 2,

    /// <summary>An asset whose only references are removed/inactive.</summary>
    UnusedAsset = 3,

    /// <summary>Two or more identical references exist for the same location.</summary>
    DuplicateReference = 4,

    /// <summary>A dependency cycle was detected in the usage graph.</summary>
    CircularReference = 5
}

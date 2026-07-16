namespace Sathus.Media.Domain.Enums;

/// <summary>
/// Lifecycle status of a media asset.
/// </summary>
public enum MediaStatus
{
    Draft = 0,
    Processing = 1,
    Ready = 2,
    Archived = 3,
    Deleted = 4,
    Failed = 5
}

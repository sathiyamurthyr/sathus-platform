namespace Sathus.Navigation.Domain.Enums;

/// <summary>
/// Operations captured in the navigation history ledger.
/// </summary>
public enum HistoryOperation
{
    Create = 0,
    Edit = 1,
    Delete = 2,
    Move = 3,
    Copy = 4,
    Clone = 5,
    Archive = 6,
    Restore = 7,
    Version = 8,
    Preview = 9,
    Publish = 10,
    Schedule = 11,
    Rollback = 12,
    Localize = 13,
    Permission = 14
}

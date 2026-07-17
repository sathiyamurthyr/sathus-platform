namespace Sathus.MediaRelations.Infrastructure.Configuration;

/// <summary>Options for the background reference scanner.</summary>
public sealed class ReferenceScannerOptions
{
    public const string SectionName = "MediaRelations:Scanner";

    /// <summary>Enables the periodic background scan.</summary>
    public bool Enabled { get; set; } = false;

    /// <summary>Interval between scan runs.</summary>
    public TimeSpan Interval { get; set; } = TimeSpan.FromHours(6);

    /// <summary>Initial delay before the first scan after startup.</summary>
    public TimeSpan InitialDelay { get; set; } = TimeSpan.FromMinutes(1);

    /// <summary>Batch size used while iterating assets during a scan.</summary>
    public int BatchSize { get; set; } = 500;

    /// <summary>Whether the background scan auto-repairs broken references.</summary>
    public bool AutoRepair { get; set; } = true;
}

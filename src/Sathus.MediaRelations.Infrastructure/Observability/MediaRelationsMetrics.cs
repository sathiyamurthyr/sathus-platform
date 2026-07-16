using System.Diagnostics.Metrics;

namespace Sathus.MediaRelations.Infrastructure.Observability;

/// <summary>
/// OpenTelemetry-compatible metrics for the Asset Relationship &amp; Usage Engine. The meter
/// name is registered with the OTEL metrics pipeline in the API host.
/// </summary>
public sealed class MediaRelationsMetrics : IDisposable
{
    public const string MeterName = "Sathus.MediaRelations";

    private readonly Meter _meter;

    public Counter<long> ReferencesCreated { get; }
    public Counter<long> ReferencesRemoved { get; }
    public Counter<long> ReferencesBroken { get; }
    public Counter<long> ReferencesRestored { get; }
    public Counter<long> ScansCompleted { get; }
    public Counter<long> ScanIssuesFound { get; }
    public Histogram<double> GraphBuildDurationMs { get; }

    public MediaRelationsMetrics()
    {
        _meter = new Meter(MeterName);
        ReferencesCreated = _meter.CreateCounter<long>("media_relations.references.created");
        ReferencesRemoved = _meter.CreateCounter<long>("media_relations.references.removed");
        ReferencesBroken = _meter.CreateCounter<long>("media_relations.references.broken");
        ReferencesRestored = _meter.CreateCounter<long>("media_relations.references.restored");
        ScansCompleted = _meter.CreateCounter<long>("media_relations.scans.completed");
        ScanIssuesFound = _meter.CreateCounter<long>("media_relations.scans.issues");
        GraphBuildDurationMs = _meter.CreateHistogram<double>("media_relations.graph.build_duration_ms");
    }

    public void Dispose() => _meter.Dispose();
}

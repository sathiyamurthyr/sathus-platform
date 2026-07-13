using Sathus.MediaRelations.Application.DTOs;

namespace Sathus.MediaRelations.Application.Interfaces;

/// <summary>
/// Background scanner that inspects the reference graph for anomalies (broken, missing,
/// orphan, unused, duplicate and circular references).
/// </summary>
public interface IReferenceScanner
{
    Task<ReferenceScanReport> ScanAsync(ReferenceScanOptions options, CancellationToken cancellationToken = default);
}

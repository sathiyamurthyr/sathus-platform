namespace Sathus.Processing.Application.Interfaces;

/// <summary>
/// Scans an asset stream for threats. A safe default no-op is provided until a
/// real scanner (e.g. ClamAV) is wired in.
/// </summary>
public interface IVirusScanService
{
    Task<bool> ScanAsync(Stream stream, string storageKey, CancellationToken cancellationToken = default);
}

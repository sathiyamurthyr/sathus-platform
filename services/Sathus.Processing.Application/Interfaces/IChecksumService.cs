namespace Sathus.Processing.Application.Interfaces;

/// <summary>
/// Computes an integrity checksum for an asset stream (SHA-256 by default).
/// </summary>
public interface IChecksumService
{
    Task<string> ComputeAsync(Stream stream, string algorithm = "sha256", CancellationToken cancellationToken = default);
}

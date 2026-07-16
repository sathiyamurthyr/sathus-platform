namespace Sathus.Processing.Application.Interfaces;

/// <summary>
/// Determines whether an asset is a duplicate of an already-processed asset by
/// comparing content checksums. Returns the existing asset id when a duplicate
/// is found, otherwise null.
/// </summary>
public interface IDuplicateDetector
{
    Task<Guid?> DetectAsync(string checksum, Guid assetId, CancellationToken cancellationToken = default);
}

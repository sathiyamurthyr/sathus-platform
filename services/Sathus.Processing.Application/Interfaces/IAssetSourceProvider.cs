namespace Sathus.Processing.Application.Interfaces;

/// <summary>
/// Opens a read stream for a stored asset. Default implementation reads from the
/// storage provider abstraction; tests supply an in-memory implementation.
/// </summary>
public interface IAssetSourceProvider
{
    Task<Stream> OpenAsync(string storageKey, CancellationToken cancellationToken = default);
}

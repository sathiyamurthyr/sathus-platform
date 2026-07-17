using Sathus.Upload.Domain.Entities;

namespace Sathus.Upload.Application.Interfaces;

public interface IChunkEngine
{
    long CalculateChunkSize(long fileSize);
    IReadOnlyList<(int Index, long Size, long Offset)> CalculateChunks(long fileSize, long chunkSize);
    byte[] ComputeChecksum(Stream stream, string algorithm = "sha256");
    Task<bool> ValidateChecksumAsync(Stream stream, string expectedChecksum, string algorithm = "sha256", CancellationToken cancellationToken = default);
    Task<Stream> GetChunkStreamAsync(Stream sourceStream, long offset, long size, CancellationToken cancellationToken = default);
}

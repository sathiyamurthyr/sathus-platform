using System.IO;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Logging;
using Sathus.Upload.Application.Interfaces;

namespace Sathus.Upload.Infrastructure.Services;

public class DefaultChunkEngine : IChunkEngine
{
    private readonly ILogger<DefaultChunkEngine> _logger;

    public DefaultChunkEngine(ILogger<DefaultChunkEngine> logger)
    {
        _logger = logger;
    }

    public long CalculateChunkSize(long fileSize)
    {
        if (fileSize <= 0) return 5 * 1024 * 1024;

        if (fileSize <= 10L * 1024 * 1024)
            return 1 * 1024 * 1024;

        if (fileSize <= 100L * 1024 * 1024)
            return 5 * 1024 * 1024;

        if (fileSize <= 1L * 1024 * 1024 * 1024)
            return 10 * 1024 * 1024;

        if (fileSize <= 10L * 1024 * 1024 * 1024)
            return 25 * 1024 * 1024;

        return 50 * 1024 * 1024;
    }

    public IReadOnlyList<(int Index, long Size, long Offset)> CalculateChunks(long fileSize, long chunkSize)
    {
        if (chunkSize <= 0) chunkSize = CalculateChunkSize(fileSize);

        var chunks = new List<(int, long, long)>();
        var offset = 0L;
        var index = 0;

        while (offset < fileSize)
        {
            var size = Math.Min(chunkSize, fileSize - offset);
            chunks.Add((index++, size, offset));
            offset += size;
        }

        return chunks;
    }

    public byte[] ComputeChecksum(Stream stream, string algorithm = "sha256")
    {
        using var hashAlgorithm = (HashAlgorithm)(algorithm.ToLowerInvariant() switch
        {
            "md5" => MD5.Create(),
            "sha1" => SHA1.Create(),
            "sha256" => SHA256.Create(),
            "sha384" => SHA384.Create(),
            "sha512" => SHA512.Create(),
            _ => throw new ArgumentException($"Unsupported hash algorithm '{algorithm}'.")
        });

        return hashAlgorithm.ComputeHash(stream);
    }

    public async Task<bool> ValidateChecksumAsync(Stream stream, string expectedChecksum, string algorithm = "sha256", CancellationToken cancellationToken = default)
    {
        try
        {
            var buffer = new MemoryStream();
            await stream.CopyToAsync(buffer, cancellationToken);
            buffer.Position = 0;
            var computed = ComputeChecksum(buffer, algorithm);
            var computedHex = Convert.ToHexString(computed).ToLowerInvariant();
            var expectedHex = expectedChecksum.Split(':')[1].ToLowerInvariant();
            return computedHex == expectedHex;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Checksum validation failed");
            return false;
        }
    }

    public async Task<Stream> GetChunkStreamAsync(Stream sourceStream, long offset, long size, CancellationToken cancellationToken = default)
    {
        if (sourceStream.CanSeek)
        {
            sourceStream.Seek(offset, SeekOrigin.Begin);
            return new BoundedStream(sourceStream, size);
        }

        var buffer = new byte[size];
        await sourceStream.ReadExactlyAsync(buffer, cancellationToken);
        return new MemoryStream(buffer, writable: false);
    }
}

internal sealed class BoundedStream : Stream
{
    private readonly Stream _inner;
    private readonly long _length;
    private long _position;

    public BoundedStream(Stream inner, long length)
    {
        _inner = inner;
        _length = length;
        _position = 0;
    }

    public override bool CanRead => true;
    public override bool CanSeek => false;
    public override bool CanWrite => false;
    public override long Length => _length;
    public override long Position
    {
        get => _position;
        set => throw new NotSupportedException();
    }

    public override int Read(byte[] buffer, int offset, int count)
    {
        var remaining = _length - _position;
        if (remaining <= 0) return 0;

        count = (int)Math.Min(count, remaining);
        var read = _inner.Read(buffer, offset, count);
        _position += read;
        return read;
    }

    public override Task<int> ReadAsync(byte[] buffer, int offset, int count, CancellationToken cancellationToken)
    {
        var remaining = _length - _position;
        if (remaining <= 0) return Task.FromResult(0);

        count = (int)Math.Min(count, remaining);
        var read = _inner.ReadAsync(buffer, offset, count, cancellationToken);
        _position += read.Result;
        return read;
    }

    public override void Flush() => throw new NotSupportedException();
    public override long Seek(long offset, SeekOrigin origin) => throw new NotSupportedException();
    public override void SetLength(long value) => throw new NotSupportedException();
    public override void Write(byte[] buffer, int offset, int count) => throw new NotSupportedException();
}

using System.IO;
using Sathus.Upload.Infrastructure.Services;

namespace Sathus.Upload.Tests.Infrastructure.Services;

public class ChunkPipelineTests
{
    private readonly DefaultChunkEngine _engine = new(Mock.Of<Microsoft.Extensions.Logging.ILogger<DefaultChunkEngine>>());

    [Fact]
    public void CalculateChunks_LargeFile_ReturnsManyChunks()
    {
        var chunks = _engine.CalculateChunks(100L * 1024 * 1024, 1 * 1024 * 1024);

        chunks.Should().HaveCount(100);
        chunks.Should().OnlyContain(c => c.Size == 1 * 1024 * 1024);
    }

    [Fact]
    public void CalculateChunks_SmallFile_ReturnsOneChunk()
    {
        var chunks = _engine.CalculateChunks(500, 1024);

        chunks.Should().HaveCount(1);
        chunks[0].Size.Should().Be(500);
    }

    [Fact]
    public void CalculateChunks_ExactMultiple_NoRounding()
    {
        var chunks = _engine.CalculateChunks(10240, 1024);

        chunks.Should().HaveCount(10);
        chunks.Should().OnlyContain(c => c.Size == 1024);
        chunks[^1].Offset.Should().Be(9 * 1024);
    }

    [Fact]
    public async Task GetChunkStreamAsync_SeekableStream_ReturnsBoundedStream()
    {
        var data = new byte[100];
        for (var i = 0; i < data.Length; i++)
            data[i] = (byte)i;

        var source = new MemoryStream(data);
        var result = await _engine.GetChunkStreamAsync(source, offset: 10, size: 20);

        result.Should().NotBeSameAs(source);
        result.Length.Should().Be(20);

        var buffer = new byte[20];
        var read = 0;
        while (read < buffer.Length)
        {
            var r = result.Read(buffer, read, buffer.Length - read);
            if (r == 0) break;
            read += r;
        }

        buffer.Should().Equal(data.Skip(10).Take(20));
    }

    [Fact]
    public async Task GetChunkStreamAsync_NonSeekableStream_ReturnsMemoryStream()
    {
        var data = new byte[50];
        for (var i = 0; i < data.Length; i++)
            data[i] = (byte)i;

        using var source = new NonSeekableStream(data);
        var result = await _engine.GetChunkStreamAsync(source, offset: 0, size: 25);

        result.Should().BeOfType<MemoryStream>();
        result.Length.Should().Be(25);

        var buffer = new byte[25];
        var read = 0;
        while (read < buffer.Length)
        {
            var r = result.Read(buffer, read, buffer.Length - read);
            if (r == 0) break;
            read += r;
        }

        buffer.Should().Equal(data.Take(25));
    }

    [Fact]
    public void ComputeChecksum_Sha256_ReturnsCorrectLength()
    {
        using var ms = new MemoryStream(System.Text.Encoding.UTF8.GetBytes("hello world"));

        var hash = _engine.ComputeChecksum(ms, "sha256");

        hash.Length.Should().Be(32);
    }

    [Fact]
    public void ComputeChecksum_Md5_ReturnsCorrectLength()
    {
        using var ms = new MemoryStream(System.Text.Encoding.UTF8.GetBytes("hello world"));

        var hash = _engine.ComputeChecksum(ms, "md5");

        hash.Length.Should().Be(16);
    }

    [Fact]
    public async Task ValidateChecksum_ValidInput_ReturnsTrue()
    {
        using var ms = new MemoryStream(System.Text.Encoding.UTF8.GetBytes("hello world"));
        var hash = _engine.ComputeChecksum(ms, "sha256");
        var hex = Convert.ToHexString(hash).ToLowerInvariant();
        ms.Position = 0;

        var result = await _engine.ValidateChecksumAsync(ms, $"sha256:{hex}", "sha256");

        result.Should().BeTrue();
    }

    [Fact]
    public async Task ValidateChecksum_InvalidInput_ReturnsFalse()
    {
        using var ms = new MemoryStream(System.Text.Encoding.UTF8.GetBytes("hello world"));

        var result = await _engine.ValidateChecksumAsync(
            ms,
            "sha256:0000000000000000000000000000000000000000000000000000000000000000",
            "sha256");

        result.Should().BeFalse();
    }

    [Fact]
    public async Task ValidateChecksum_MalformedInput_ReturnsFalse()
    {
        using var ms = new MemoryStream(System.Text.Encoding.UTF8.GetBytes("hello world"));

        var result = await _engine.ValidateChecksumAsync(ms, "not-a-valid-checksum", "sha256");

        result.Should().BeFalse();
    }

    private sealed class NonSeekableStream : Stream
    {
        private readonly MemoryStream _inner;

        public NonSeekableStream(byte[] data) => _inner = new MemoryStream(data);

        public override bool CanRead => true;
        public override bool CanSeek => false;
        public override bool CanWrite => false;
        public override long Length => _inner.Length;
        public override long Position
        {
            get => _inner.Position;
            set => throw new NotSupportedException();
        }

        public override void Flush() => _inner.Flush();

        public override long Seek(long offset, SeekOrigin origin) => throw new NotSupportedException();

        public override void SetLength(long value) => throw new NotSupportedException();

        public override void Write(byte[] buffer, int offset, int count) => throw new NotSupportedException();

        public override int Read(byte[] buffer, int offset, int count) => _inner.Read(buffer, offset, count);

        public override Task<int> ReadAsync(byte[] buffer, int offset, int count, CancellationToken cancellationToken)
            => _inner.ReadAsync(buffer, offset, count, cancellationToken);
    }
}

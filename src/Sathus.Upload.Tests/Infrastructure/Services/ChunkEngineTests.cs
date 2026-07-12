using FluentAssertions;
using Xunit;

namespace Sathus.Upload.Tests.Infrastructure.Services;

public class ChunkEngineTests
{
    private readonly DefaultChunkEngine _engine = new(Mock.Of<Microsoft.Extensions.Logging.ILogger<DefaultChunkEngine>>());

    [Theory]
    [InlineData(500 * 1024, 1024 * 1024)]
    [InlineData(10 * 1024 * 1024, 1024 * 1024)]
    [InlineData(50 * 1024 * 1024, 5 * 1024 * 1024)]
    [InlineData(500L * 1024 * 1024 * 1024, 50 * 1024 * 1024)]
    public void CalculateChunkSize_ReturnsAppropriateSize(long fileSize, long expectedMinChunk)
    {
        var chunkSize = _engine.CalculateChunkSize(fileSize);
        chunkSize.Should().BeGreaterOrEqualTo(expectedMinChunk);
    }

    [Fact]
    public void CalculateChunks_SmallFile_ReturnsSingleChunk()
    {
        var chunks = _engine.CalculateChunks(500, 1024);
        chunks.Should().HaveCount(1);
        chunks[0].Size.Should().Be(500);
    }

    [Fact]
    public void CalculateChunks_MultipleChunks_ReturnsCorrectCount()
    {
        var chunks = _engine.CalculateChunks(10 * 1024, 1024);
        chunks.Should().HaveCount(10);
        chunks.Last().Offset.Should().Be(9 * 1024);
    }

    [Fact]
    public void ComputeChecksum_ValidStream_ReturnsHash()
    {
        using var ms = new MemoryStream(System.Text.Encoding.UTF8.GetBytes("hello world"));
        var hash = _engine.ComputeChecksum(ms, "sha256");
        hash.Should().NotBeEmpty();
        hash.Length.Should().Be(32);
    }

    [Fact]
    public async Task ValidateChecksum_ValidChecksum_ReturnsTrue()
    {
        using var ms = new MemoryStream(System.Text.Encoding.UTF8.GetBytes("hello world"));
        var hash = _engine.ComputeChecksum(ms, "sha256");
        var hex = Convert.ToHexString(hash).ToLowerInvariant();
        ms.Position = 0;

        var result = await _engine.ValidateChecksumAsync(ms, $"sha256:{hex}", "sha256");
        result.Should().BeTrue();
    }

    [Fact]
    public async Task ValidateChecksum_InvalidChecksum_ReturnsFalse()
    {
        using var ms = new MemoryStream(System.Text.Encoding.UTF8.GetBytes("hello world"));
        var result = await _engine.ValidateChecksumAsync(ms, "sha256:0000000000000000000000000000000000000000000000000000000000000000", "sha256");
        result.Should().BeFalse();
    }
}

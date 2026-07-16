using FluentAssertions;
using Xunit;

namespace Sathus.Upload.Tests.Domain;

public class UploadChunkEdgeTests
{
    [Fact]
    public void Create_NegativeChunkIndex_ThrowsArgumentOutOfRangeException()
    {
        var act = () => new UploadChunk(Guid.NewGuid(), -1, 1024, 0);

        act.Should().Throw<ArgumentOutOfRangeException>()
            .WithParameterName("chunkIndex");
    }

    [Fact]
    public void Create_NegativeSize_ThrowsArgumentOutOfRangeException()
    {
        var act = () => new UploadChunk(Guid.NewGuid(), 0, -1, 0);

        act.Should().Throw<ArgumentOutOfRangeException>()
            .WithParameterName("size");
    }

    [Fact]
    public void Create_NegativeOffset_ThrowsArgumentOutOfRangeException()
    {
        var act = () => new UploadChunk(Guid.NewGuid(), 0, 1024, -1);

        act.Should().Throw<ArgumentOutOfRangeException>()
            .WithParameterName("offset");
    }

    [Fact]
    public void Create_ZeroValues_SetsDefaults()
    {
        var chunk = new UploadChunk(Guid.NewGuid(), 0, 0, 0);

        chunk.ChunkIndex.Should().Be(0);
        chunk.Size.Should().Be(0);
        chunk.Offset.Should().Be(0);
        chunk.Status.Should().Be(ChunkStatus.Pending);
        chunk.RetryCount.Should().Be(0);
    }

    [Fact]
    public void MarkUploading_SetsStartedAtAndStatus()
    {
        var chunk = new UploadChunk(Guid.NewGuid(), 0, 1024, 0);

        chunk.MarkUploading();

        chunk.Status.Should().Be(ChunkStatus.Uploading);
        chunk.StartedAt.Should().NotBeNull();
        chunk.StartedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
    }

    [Fact]
    public void MarkCompleted_SetsCompletedAtAndStorageKey()
    {
        var chunk = new UploadChunk(Guid.NewGuid(), 0, 1024, 0);

        chunk.MarkCompleted("chunk-storage-key");

        chunk.Status.Should().Be(ChunkStatus.Completed);
        chunk.CompletedAt.Should().NotBeNull();
        chunk.StorageKey.Should().Be("chunk-storage-key");
    }

    [Fact]
    public void MarkCompleted_WithoutStorageKey_LeavesStorageKeyNull()
    {
        var chunk = new UploadChunk(Guid.NewGuid(), 0, 1024, 0);

        chunk.MarkCompleted();

        chunk.Status.Should().Be(ChunkStatus.Completed);
        chunk.StorageKey.Should().BeNull();
    }

    [Fact]
    public void MarkFailed_IncrementsRetryCount()
    {
        var chunk = new UploadChunk(Guid.NewGuid(), 0, 1024, 0);

        chunk.MarkFailed();
        chunk.MarkFailed();

        chunk.Status.Should().Be(ChunkStatus.Failed);
        chunk.RetryCount.Should().Be(2);
    }

    [Fact]
    public void MarkSkipped_TransitionsToSkipped()
    {
        var chunk = new UploadChunk(Guid.NewGuid(), 0, 1024, 0);

        chunk.MarkSkipped();

        chunk.Status.Should().Be(ChunkStatus.Skipped);
        chunk.RetryCount.Should().Be(0);
    }

    [Fact]
    public void MarkUploading_AfterCompleted_DoesNotResetCompletedAt()
    {
        var chunk = new UploadChunk(Guid.NewGuid(), 0, 1024, 0);
        chunk.MarkCompleted("key");
        var completedAt = chunk.CompletedAt;

        chunk.MarkUploading();

        chunk.Status.Should().Be(ChunkStatus.Uploading);
        chunk.CompletedAt.Should().Be(completedAt);
    }
}

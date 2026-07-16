using FluentAssertions;
using Xunit;

namespace Sathus.Upload.Tests.Domain;

public class UploadChunkTests
{
    [Fact]
    public void Create_ValidParameters_SetsDefaults()
    {
        var chunk = new UploadChunk(Guid.NewGuid(), 0, 1024, 0);

        chunk.ChunkIndex.Should().Be(0);
        chunk.Size.Should().Be(1024);
        chunk.Offset.Should().Be(0);
        chunk.Status.Should().Be(ChunkStatus.Pending);
        chunk.RetryCount.Should().Be(0);
    }

    [Fact]
    public void MarkUploading_TransitionsToUploading()
    {
        var chunk = new UploadChunk(Guid.NewGuid(), 0, 1024, 0);
        chunk.MarkUploading();

        chunk.Status.Should().Be(ChunkStatus.Uploading);
        chunk.StartedAt.Should().NotBeNull();
    }

    [Fact]
    public void MarkCompleted_TransitionsToCompleted()
    {
        var chunk = new UploadChunk(Guid.NewGuid(), 0, 1024, 0);
        chunk.MarkCompleted("chunk-key");

        chunk.Status.Should().Be(ChunkStatus.Completed);
        chunk.CompletedAt.Should().NotBeNull();
        chunk.StorageKey.Should().Be("chunk-key");
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
    }
}

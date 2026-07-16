using FluentAssertions;
using Xunit;

namespace Sathus.Upload.Tests.Domain;

public class UploadSessionTests
{
    [Fact]
    public void Create_ValidParameters_InitializesCorrectly()
    {
        var session = new UploadSession(
            sessionId: "test-session-123",
            fileName: FileName.Create("document.pdf"),
            fileExtension: FileExtension.Create("pdf"),
            mimeType: MimeType.Create("application/pdf"),
            fileSize: FileSize.Create(10 * 1024 * 1024),
            chunkSize: 1024 * 1024,
            createdBy: Guid.NewGuid());

        session.SessionId.Should().Be("test-session-123");
        session.FileName.Value.Should().Be("document.pdf");
        session.Status.Should().Be(UploadStatus.Pending);
        session.TotalChunks.Should().Be(10);
        session.UploadedChunks.Should().Be(0);
        session.Progress.Should().Be(0);
    }

    [Fact]
    public void Start_TransitionsToUploading()
    {
        var session = CreateSession();
        session.Start();

        session.Status.Should().Be(UploadStatus.Uploading);
        session.DomainEvents.Should().Contain(e => e is UploadStartedEvent);
    }

    [Fact]
    public void Pause_TransitionsToPaused()
    {
        var session = CreateSession();
        session.Start();
        session.Pause();

        session.Status.Should().Be(UploadStatus.Paused);
    }

    [Fact]
    public void Resume_TransitionsBackToUploading()
    {
        var session = CreateSession();
        session.Start();
        session.Pause();
        session.Resume();

        session.Status.Should().Be(UploadStatus.Uploading);
        session.DomainEvents.Should().Contain(e => e is UploadResumedEvent);
    }

    [Fact]
    public void Cancel_TransitionsToCancelled()
    {
        var session = CreateSession();
        session.Start();
        session.Cancel();

        session.Status.Should().Be(UploadStatus.Cancelled);
        session.DomainEvents.Should().Contain(e => e is UploadCancelledEvent);
    }

    [Fact]
    public void Complete_TransitionsToCompleted()
    {
        var session = CreateSession();
        session.Start();
        session.InitializeChunks();
        foreach (var chunk in session.Chunks)
        {
            chunk.MarkCompleted();
        }
        session.Complete("uploads/test-key");

        session.Status.Should().Be(UploadStatus.Completed);
        session.Progress.Should().Be(100);
        session.StorageKey!.Value.Should().Be("uploads/test-key");
    }

    [Fact]
    public void MarkChunkCompleted_UpdatesProgress()
    {
        var session = CreateSession();
        session.InitializeChunks();
        session.Start();

        session.MarkChunkCompleted(0);
        session.UploadedChunks.Should().Be(1);
        session.Progress.Should().BeApproximately(100.0 / session.TotalChunks, 0.01);
    }

    [Fact]
    public void GetMissingChunkIndices_ReturnsIncompleteChunks()
    {
        var session = CreateSession();
        session.InitializeChunks();
        session.Chunks.First().MarkCompleted();

        var missing = session.GetMissingChunkIndices();
        missing.Should().HaveCount(session.TotalChunks - 1);
        missing.Should().NotContain(0);
    }

    private static UploadSession CreateSession()
    {
        return new UploadSession(
            sessionId: Guid.NewGuid().ToString("N"),
            fileName: FileName.Create("test.pdf"),
            fileExtension: FileExtension.Create("pdf"),
            mimeType: MimeType.Create("application/pdf"),
            fileSize: FileSize.Create(5 * 1024 * 1024),
            chunkSize: 1024 * 1024);
    }
}

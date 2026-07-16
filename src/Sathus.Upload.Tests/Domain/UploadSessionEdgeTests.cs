using FluentAssertions;
using Xunit;

namespace Sathus.Upload.Tests.Domain;

public class UploadSessionEdgeTests
{
    private static UploadSession CreateSession(long fileSize = 5 * 1024 * 1024, long chunkSize = 1024 * 1024)
    {
        return new UploadSession(
            sessionId: Guid.NewGuid().ToString("N"),
            fileName: FileName.Create("test.pdf"),
            fileExtension: FileExtension.Create("pdf"),
            mimeType: MimeType.Create("application/pdf"),
            fileSize: FileSize.Create(fileSize),
            chunkSize: chunkSize);
    }

    [Fact]
    public void Start_WhenAlreadyUploading_ThrowsInvalidOperationException()
    {
        var session = CreateSession();
        session.Start();

        var act = () => session.Start();

        act.Should().Throw<InvalidOperationException>();
    }

    [Fact]
    public void Start_WhenPaused_ThrowsInvalidOperationException()
    {
        var session = CreateSession();
        session.Start();
        session.Pause();

        var act = () => session.Start();

        act.Should().Throw<InvalidOperationException>();
    }

    [Fact]
    public void Start_WhenCompleted_ThrowsInvalidOperationException()
    {
        var session = CreateSession();
        session.Start();
        session.Complete("key");

        var act = () => session.Start();

        act.Should().Throw<InvalidOperationException>();
    }

    [Fact]
    public void Pause_WhenNotUploading_ThrowsInvalidOperationException()
    {
        var session = CreateSession();

        var act = () => session.Pause();

        act.Should().Throw<InvalidOperationException>();
    }

    [Fact]
    public void Resume_WhenNotPaused_ThrowsInvalidOperationException()
    {
        var session = CreateSession();
        session.Start();

        var act = () => session.Resume();

        act.Should().Throw<InvalidOperationException>();
    }

    [Fact]
    public void Cancel_WhenCompleted_ThrowsInvalidOperationException()
    {
        var session = CreateSession();
        session.Start();
        session.Complete("key");

        var act = () => session.Cancel();

        act.Should().Throw<InvalidOperationException>();
    }

    [Fact]
    public void Complete_WithoutStorageKey_SetsDefaultStorageKey()
    {
        var session = CreateSession();
        session.Start();

        session.Complete(null);

        session.Status.Should().Be(UploadStatus.Completed);
        session.Progress.Should().Be(100);
        session.StorageKey.Should().NotBeNull();
        session.StorageKey!.Value.Should().Be($"uploads/{session.SessionId}/{session.FileName.Value}");
    }

    [Fact]
    public void Complete_WithStorageKey_UsesProvidedKey()
    {
        var session = CreateSession();
        session.Start();

        session.Complete("custom/key/path");

        session.StorageKey!.Value.Should().Be("custom/key/path");
    }

    [Fact]
    public void Fail_SetsStatusAndErrorMessage()
    {
        var session = CreateSession();
        session.Start();

        session.Fail("something went wrong");

        session.Status.Should().Be(UploadStatus.Failed);
        session.ErrorMessage.Should().Be("something went wrong");
    }

    [Fact]
    public void InitializeChunks_CalculatesCorrectTotals()
    {
        var session = CreateSession(fileSize: 5 * 1024 * 1024, chunkSize: 1024 * 1024);

        session.InitializeChunks();

        session.Chunks.Should().HaveCount(5);
        session.Chunks.Should().OnlyContain(c => c.Size == 1024 * 1024);
        session.Chunks.Select(c => c.ChunkIndex).Should().Equal(0, 1, 2, 3, 4);
    }

    [Fact]
    public void InitializeChunks_WithRemainder_CalculatesLastChunkSize()
    {
        var session = CreateSession(fileSize: 3 * 1024 * 1024 + 500, chunkSize: 1024 * 1024);

        session.InitializeChunks();

        session.Chunks.Should().HaveCount(4);
        session.Chunks.Last().Size.Should().Be(500);
    }

    [Fact]
    public void InitializeChunks_ClearsExistingChunks()
    {
        var session = CreateSession();
        session.InitializeChunks();
        session.Chunks.Add(new UploadChunk(session.Id, 99, 10, 0));

        session.InitializeChunks();

        session.Chunks.Should().HaveCount(session.TotalChunks);
        session.Chunks.Select(c => c.ChunkIndex).Should().NotContain(99);
    }

    [Fact]
    public void GetMissingChunkIndices_ExcludesCompletedAndSkipped()
    {
        var session = CreateSession();
        session.InitializeChunks();
        session.Chunks.ElementAt(0).MarkCompleted();
        session.Chunks.ElementAt(2).MarkSkipped();

        var missing = session.GetMissingChunkIndices();

        missing.Should().NotContain(0);
        missing.Should().NotContain(2);
        missing.Should().Contain(1);
        missing.Should().Contain(3);
        missing.Should().Contain(4);
        missing.Should().BeInAscendingOrder();
    }

    [Fact]
    public void GetMissingChunkIndices_WhenAllComplete_ReturnsEmpty()
    {
        var session = CreateSession();
        session.InitializeChunks();
        foreach (var chunk in session.Chunks)
        {
            chunk.MarkCompleted();
        }

        var missing = session.GetMissingChunkIndices();

        missing.Should().BeEmpty();
    }

    [Fact]
    public void UpdateProgress_WhenFinished_AutoCompletes()
    {
        var session = CreateSession();
        session.Start();
        session.InitializeChunks();

        session.UpdateProgress(session.TotalChunks);

        session.Status.Should().Be(UploadStatus.Completed);
        session.Progress.Should().Be(100);
        session.DomainEvents.Should().Contain(e => e is UploadCompletedEvent);
        session.DomainEvents.Should().NotContain(e => e is UploadProgressUpdatedEvent);
    }

    [Fact]
    public void UpdateProgress_WhenNotFinished_RaisesProgressUpdatedEvent()
    {
        var session = CreateSession();
        session.Start();
        session.InitializeChunks();

        session.UpdateProgress(2);

        session.UploadedChunks.Should().Be(2);
        session.Progress.Should().BeApproximately(2.0 / session.TotalChunks * 100, 0.001);
        session.DomainEvents.Should().Contain(e => e is UploadProgressUpdatedEvent);
        session.DomainEvents.Should().NotContain(e => e is UploadCompletedEvent);
    }

    [Fact]
    public void UploadProgressUpdatedEvent_RaisedOnProgress()
    {
        var session = CreateSession();
        session.Start();
        session.InitializeChunks();

        session.UpdateProgress(1);

        var evt = session.DomainEvents.OfType<UploadProgressUpdatedEvent>().Single();
        evt.SessionId.Should().Be(session.Id);
        evt.Progress.Should().BeApproximately(1.0 / session.TotalChunks * 100, 0.001);
    }

    [Fact]
    public void UploadStartedEvent_RaisedOnStart()
    {
        var session = CreateSession();

        session.Start();

        var evt = session.DomainEvents.OfType<UploadStartedEvent>().Single();
        evt.SessionId.Should().Be(session.Id);
    }

    [Fact]
    public void UploadCompletedEvent_RaisedOnComplete()
    {
        var session = CreateSession();
        session.Start();

        session.Complete("key");

        var evt = session.DomainEvents.OfType<UploadCompletedEvent>().Single();
        evt.SessionId.Should().Be(session.Id);
    }

    [Fact]
    public void UploadFailedEvent_RaisedOnFail()
    {
        var session = CreateSession();
        session.Start();

        session.Fail("boom");

        var evt = session.DomainEvents.OfType<UploadFailedEvent>().Single();
        evt.SessionId.Should().Be(session.Id);
        evt.ErrorMessage.Should().Be("boom");
    }

    [Fact]
    public void UploadCancelledEvent_RaisedOnCancel()
    {
        var session = CreateSession();
        session.Start();

        session.Cancel();

        var evt = session.DomainEvents.OfType<UploadCancelledEvent>().Single();
        evt.SessionId.Should().Be(session.Id);
    }

    [Fact]
    public void UploadResumedEvent_RaisedOnResume()
    {
        var session = CreateSession();
        session.Start();
        session.Pause();

        session.Resume();

        var evt = session.DomainEvents.OfType<UploadResumedEvent>().Single();
        evt.SessionId.Should().Be(session.Id);
    }

    [Fact]
    public void MarkChunkCompleted_AllChunks_AutoCompletes()
    {
        var session = CreateSession(fileSize: 3 * 1024 * 1024, chunkSize: 1024 * 1024);
        session.InitializeChunks();
        session.Start();

        session.MarkChunkCompleted(0);
        session.MarkChunkCompleted(1);
        session.MarkChunkCompleted(2);

        session.Status.Should().Be(UploadStatus.Completed);
        session.Progress.Should().Be(100);
        session.DomainEvents.Should().Contain(e => e is UploadCompletedEvent);
    }

    [Fact]
    public void MarkChunkCompleted_UnknownIndex_ThrowsArgumentException()
    {
        var session = CreateSession();
        session.InitializeChunks();
        session.Start();

        var act = () => session.MarkChunkCompleted(999);

        act.Should().Throw<ArgumentException>()
            .WithParameterName("chunkIndex");
    }

    [Fact]
    public void MarkChunkFailed_UnknownIndex_ThrowsArgumentException()
    {
        var session = CreateSession();
        session.InitializeChunks();
        session.Start();

        var act = () => session.MarkChunkFailed(999);

        act.Should().Throw<ArgumentException>()
            .WithParameterName("chunkIndex");
    }

    [Fact]
    public void MarkChunkFailed_RaisesChunkFailedEvent()
    {
        var session = CreateSession();
        session.InitializeChunks();
        session.Start();

        session.MarkChunkFailed(0);

        var evt = session.DomainEvents.OfType<ChunkFailedEvent>().Single();
        evt.SessionId.Should().Be(session.Id);
        evt.ChunkIndex.Should().Be(0);
    }

    [Fact]
    public void Create_FolderUpload_StoresFolderPath()
    {
        var session = new UploadSession(
            sessionId: Guid.NewGuid().ToString("N"),
            fileName: FileName.Create("folder"),
            fileExtension: FileExtension.Create("bin"),
            mimeType: MimeType.Create("application/octet-stream"),
            fileSize: FileSize.Create(1024),
            chunkSize: 1024 * 1024,
            isFolder: true,
            folderPath: "/uploads/2026");

        session.IsFolder.Should().BeTrue();
        session.FolderPath.Should().Be("/uploads/2026");
    }

    [Fact]
    public void Create_FolderUpload_WithEmptyFolderPath_DoesNotThrow()
    {
        var act = () => new UploadSession(
            sessionId: Guid.NewGuid().ToString("N"),
            fileName: FileName.Create("folder"),
            fileExtension: FileExtension.Create("bin"),
            mimeType: MimeType.Create("application/octet-stream"),
            fileSize: FileSize.Create(1024),
            chunkSize: 1024 * 1024,
            isFolder: true,
            folderPath: string.Empty);

        act.Should().NotThrow();
    }

    [Fact]
    public void Create_FolderUpload_WithInvalidPath_DoesNotThrow()
    {
        var act = () => new UploadSession(
            sessionId: Guid.NewGuid().ToString("N"),
            fileName: FileName.Create("folder"),
            fileExtension: FileExtension.Create("bin"),
            mimeType: MimeType.Create("application/octet-stream"),
            fileSize: FileSize.Create(1024),
            chunkSize: 1024 * 1024,
            isFolder: true,
            folderPath: "::invalid::path??");

        act.Should().NotThrow();
    }
}

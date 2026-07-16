using Moq;
using Sathus.Storage.Domain.Interfaces;
using Sathus.Storage.Domain.Results;
using Sathus.Storage.Domain.Exceptions;
using Sathus.Upload.Application.Commands.UploadChunk;
using Sathus.Upload.Application.Interfaces;
using Sathus.Upload.Domain.Entities;
using Sathus.Upload.Infrastructure.Persistence;
using Sathus.Upload.Infrastructure.Repositories;
using Sathus.Upload.Infrastructure.Services;
using Sathus.Upload.Tests.Infrastructure;
using Xunit;

namespace Sathus.Upload.Tests.Application.Commands;

public class UploadChunkCommandHandlerTests
{
    [Fact]
    public async Task Handle_ChunkAlreadyCompleted_ReturnsExistingChunk()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var repository = new EfUploadRepository(dbContext, Mock.Of<MediatR.IMediator>());
        var storageFactory = new Mock<IStorageProviderFactory>();
        var chunkEngine = new DefaultChunkEngine(Mock.Of<Microsoft.Extensions.Logging.ILogger<DefaultChunkEngine>>());

        var session = new UploadSession(
            sessionId: "session-1",
            fileName: FileName.Create("test.pdf"),
            fileExtension: FileExtension.Create("pdf"),
            mimeType: MimeType.Create("application/pdf"),
            fileSize: FileSize.Create(1024),
            chunkSize: 1024);
        session.InitializeChunks();
        session.Start();
        session.Chunks.First().MarkCompleted("chunk-key");
        await repository.AddAsync(session);
        await repository.SaveChangesAsync();

        var handler = new UploadChunkCommandHandler(repository, storageFactory.Object, chunkEngine, Mock.Of<MediatR.IMediator>());

        using var ms = new MemoryStream(new byte[1024]);
        var command = new UploadChunkCommand(session.Id, 0, ms, "sha256:abc");

        var result = await handler.Handle(command, CancellationToken.None);

        result.ChunkIndex.Should().Be(0);
        result.Status.Should().Be("Completed");
    }

    [Fact]
    public async Task Handle_SessionNotFound_ThrowsNotFoundException()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var repository = new EfUploadRepository(dbContext, Mock.Of<MediatR.IMediator>());
        var storageFactory = new Mock<IStorageProviderFactory>();
        var chunkEngine = new DefaultChunkEngine(Mock.Of<Microsoft.Extensions.Logging.ILogger<DefaultChunkEngine>>());

        var handler = new UploadChunkCommandHandler(repository, storageFactory.Object, chunkEngine, Mock.Of<MediatR.IMediator>());

        using var ms = new MemoryStream(new byte[1024]);
        var command = new UploadChunkCommand(Guid.NewGuid(), 0, ms, "sha256:abc");

        await Assert.ThrowsAsync<UploadSessionNotFoundException>(() => handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_SessionNotUploading_ThrowsInvalidUploadStateException()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var repository = new EfUploadRepository(dbContext, Mock.Of<MediatR.IMediator>());
        var storageFactory = new Mock<IStorageProviderFactory>();
        var chunkEngine = new DefaultChunkEngine(Mock.Of<Microsoft.Extensions.Logging.ILogger<DefaultChunkEngine>>());

        var session = new UploadSession(
            sessionId: "session-2",
            fileName: FileName.Create("test.pdf"),
            fileExtension: FileExtension.Create("pdf"),
            mimeType: MimeType.Create("application/pdf"),
            fileSize: FileSize.Create(1024),
            chunkSize: 1024);
        session.InitializeChunks();
        session.Start();
        session.Pause();
        await repository.AddAsync(session);
        await repository.SaveChangesAsync();

        var handler = new UploadChunkCommandHandler(repository, storageFactory.Object, chunkEngine, Mock.Of<MediatR.IMediator>());

        using var ms = new MemoryStream(new byte[1024]);
        var command = new UploadChunkCommand(session.Id, 0, ms, "sha256:abc");

        await Assert.ThrowsAsync<InvalidUploadStateException>(() => handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_ChunkNotFound_ThrowsChunkValidationException()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var repository = new EfUploadRepository(dbContext, Mock.Of<MediatR.IMediator>());
        var storageFactory = new Mock<IStorageProviderFactory>();
        var chunkEngine = new DefaultChunkEngine(Mock.Of<Microsoft.Extensions.Logging.ILogger<DefaultChunkEngine>>());

        var session = new UploadSession(
            sessionId: "session-3",
            fileName: FileName.Create("test.pdf"),
            fileExtension: FileExtension.Create("pdf"),
            mimeType: MimeType.Create("application/pdf"),
            fileSize: FileSize.Create(1024),
            chunkSize: 1024);
        session.InitializeChunks();
        session.Start();
        await repository.AddAsync(session);
        await repository.SaveChangesAsync();

        var handler = new UploadChunkCommandHandler(repository, storageFactory.Object, chunkEngine, Mock.Of<MediatR.IMediator>());

        using var ms = new MemoryStream(new byte[1024]);
        var command = new UploadChunkCommand(session.Id, 99, ms, "sha256:abc");

        await Assert.ThrowsAsync<ChunkValidationException>(() => handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_Success_ReturnsCompletedChunk()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var repository = new EfUploadRepository(dbContext, Mock.Of<MediatR.IMediator>());
        var storageFactory = new Mock<IStorageProviderFactory>();
        var chunkEngine = new DefaultChunkEngine(Mock.Of<Microsoft.Extensions.Logging.ILogger<DefaultChunkEngine>>());

        var session = new UploadSession(
            sessionId: "session-4",
            fileName: FileName.Create("test.pdf"),
            fileExtension: FileExtension.Create("pdf"),
            mimeType: MimeType.Create("application/pdf"),
            fileSize: FileSize.Create(1024),
            chunkSize: 1024);
        session.InitializeChunks();
        session.Start();
        await repository.AddAsync(session);
        await repository.SaveChangesAsync();

        var provider = new Mock<IStorageProvider>();
        var successResult = new StorageResult(true, null, null);
        provider.Setup(p => p.UploadAsync(It.IsAny<string>(), It.IsAny<Stream>(), It.IsAny<string>(), (Dictionary<string, string>?)null, It.IsAny<CancellationToken>()))
            .ReturnsAsync(successResult);
        storageFactory.Setup(f => f.Resolve(null)).Returns(provider.Object);

        var handler = new UploadChunkCommandHandler(repository, storageFactory.Object, chunkEngine, Mock.Of<MediatR.IMediator>());

        using var ms = new MemoryStream(new byte[1024]);
        var command = new UploadChunkCommand(session.Id, 0, ms, null);

        var result = await handler.Handle(command, CancellationToken.None);

        result.ChunkIndex.Should().Be(0);
        result.Status.Should().Be("Completed");
    }

    [Fact]
    public async Task Handle_UploadFails_MarksChunkFailedAndThrows()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var repository = new EfUploadRepository(dbContext, Mock.Of<MediatR.IMediator>());
        var storageFactory = new Mock<IStorageProviderFactory>();
        var chunkEngine = new DefaultChunkEngine(Mock.Of<Microsoft.Extensions.Logging.ILogger<DefaultChunkEngine>>());

        var session = new UploadSession(
            sessionId: "session-5",
            fileName: FileName.Create("test.pdf"),
            fileExtension: FileExtension.Create("pdf"),
            mimeType: MimeType.Create("application/pdf"),
            fileSize: FileSize.Create(1024),
            chunkSize: 1024);
        session.InitializeChunks();
        session.Start();
        await repository.AddAsync(session);
        await repository.SaveChangesAsync();

        var provider = new Mock<IStorageProvider>();
        var failResult = new StorageResult(false, "Upload failed", null);
        provider.Setup(p => p.UploadAsync(It.IsAny<string>(), It.IsAny<Stream>(), It.IsAny<string>(), (Dictionary<string, string>?)null, It.IsAny<CancellationToken>()))
            .ReturnsAsync(failResult);
        storageFactory.Setup(f => f.Resolve(null)).Returns(provider.Object);

        var handler = new UploadChunkCommandHandler(repository, storageFactory.Object, chunkEngine, Mock.Of<MediatR.IMediator>());

        using var ms = new MemoryStream(new byte[1024]);
        var command = new UploadChunkCommand(session.Id, 0, ms, null);

        await Assert.ThrowsAsync<UploadFailedException>(() => handler.Handle(command, CancellationToken.None));
    }
}

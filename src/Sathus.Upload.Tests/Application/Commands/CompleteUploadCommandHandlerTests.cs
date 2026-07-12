using Moq;
using Sathus.Storage.Domain.Interfaces;
using Sathus.Upload.Application.Commands.CompleteUpload;
using Sathus.Upload.Application.Interfaces;
using Sathus.Upload.Domain.Entities;
using Sathus.Upload.Infrastructure.Persistence;
using Sathus.Upload.Infrastructure.Repositories;
using Sathus.Upload.Infrastructure.Services;
using Sathus.Upload.Tests.Infrastructure;
using Xunit;

namespace Sathus.Upload.Tests.Application.Commands;

public class CompleteUploadCommandHandlerTests
{
    [Fact]
    public async Task Handle_AllChunksComplete_ReturnsSuccess()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var repository = new EfUploadRepository(dbContext, Mock.Of<MediatR.IMediator>());
        var validator = new Mock<IUploadValidator>();
        var virusScan = new Mock<IVirusScanService>();
        var metadataExtractor = new Mock<IMetadataExtractionService>();

        var session = new UploadSession(
            sessionId: "session-2",
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

        var handler = new CompleteUploadCommandHandler(repository, validator.Object, virusScan.Object, metadataExtractor.Object, Mock.Of<MediatR.IMediator>());

        var result = await handler.Handle(new CompleteUploadCommand(session.Id), CancellationToken.None);

        result.Status.Should().Be("Completed");
        result.StorageKey.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task Handle_MissingChunks_ThrowsInvalidUploadStateException()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var repository = new EfUploadRepository(dbContext, Mock.Of<MediatR.IMediator>());

        var session = new UploadSession(
            sessionId: "session-3",
            fileName: FileName.Create("test.pdf"),
            fileExtension: FileExtension.Create("pdf"),
            mimeType: MimeType.Create("application/pdf"),
            fileSize: FileSize.Create(2048),
            chunkSize: 1024);
        session.InitializeChunks();
        session.Start();
        await repository.AddAsync(session);
        await repository.SaveChangesAsync();

        var handler = new CompleteUploadCommandHandler(repository, Mock.Of<IUploadValidator>(), Mock.Of<IVirusScanService>(), Mock.Of<IMetadataExtractionService>(), Mock.Of<MediatR.IMediator>());

        await Assert.ThrowsAsync<InvalidUploadStateException>(() => handler.Handle(new CompleteUploadCommand(session.Id), CancellationToken.None));
    }

    [Fact]
    public async Task Handle_SessionNotFound_ThrowsNotFoundException()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var repository = new EfUploadRepository(dbContext, Mock.Of<MediatR.IMediator>());

        var handler = new CompleteUploadCommandHandler(repository, Mock.Of<IUploadValidator>(), Mock.Of<IVirusScanService>(), Mock.Of<IMetadataExtractionService>(), Mock.Of<MediatR.IMediator>());

        await Assert.ThrowsAsync<UploadSessionNotFoundException>(() => handler.Handle(new CompleteUploadCommand(Guid.NewGuid()), CancellationToken.None));
    }

    [Fact]
    public async Task Handle_InvalidState_ThrowsInvalidUploadStateException()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var repository = new EfUploadRepository(dbContext, Mock.Of<MediatR.IMediator>());

        var session = new UploadSession(
            sessionId: "session-4",
            fileName: FileName.Create("test.pdf"),
            fileExtension: FileExtension.Create("pdf"),
            mimeType: MimeType.Create("application/pdf"),
            fileSize: FileSize.Create(1024),
            chunkSize: 1024);
        await repository.AddAsync(session);
        await repository.SaveChangesAsync();

        var handler = new CompleteUploadCommandHandler(repository, Mock.Of<IUploadValidator>(), Mock.Of<IVirusScanService>(), Mock.Of<IMetadataExtractionService>(), Mock.Of<MediatR.IMediator>());

        await Assert.ThrowsAsync<InvalidUploadStateException>(() => handler.Handle(new CompleteUploadCommand(session.Id), CancellationToken.None));
    }
}

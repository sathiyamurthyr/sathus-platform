using Moq;
using Sathus.Upload.Application.Commands.CancelUpload;
using Sathus.Upload.Domain.Entities;
using Sathus.Upload.Infrastructure.Persistence;
using Sathus.Upload.Infrastructure.Repositories;
using Sathus.Upload.Tests.Infrastructure;
using Xunit;

namespace Sathus.Upload.Tests.Application.Commands;

public class CancelUploadCommandHandlerTests
{
    [Fact]
    public async Task Handle_SessionExists_CancelsSession()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var repository = new EfUploadRepository(dbContext, Mock.Of<MediatR.IMediator>());

        var session = new UploadSession(
            sessionId: "cancel-session",
            fileName: FileName.Create("doc.pdf"),
            fileExtension: FileExtension.Create("pdf"),
            mimeType: MimeType.Create("application/pdf"),
            fileSize: FileSize.Create(1024),
            chunkSize: 1024);
        session.Start();
        await repository.AddAsync(session);
        await repository.SaveChangesAsync();

        var handler = new CancelUploadCommandHandler(repository);
        var result = await handler.Handle(new CancelUploadCommand(session.Id, Guid.NewGuid()), CancellationToken.None);

        result.Status.Should().Be("Cancelled");
    }

    [Fact]
    public async Task Handle_SessionNotFound_ThrowsNotFoundException()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var repository = new EfUploadRepository(dbContext, Mock.Of<MediatR.IMediator>());

        var handler = new CancelUploadCommandHandler(repository);

        await Assert.ThrowsAsync<UploadSessionNotFoundException>(() =>
            handler.Handle(new CancelUploadCommand(Guid.NewGuid()), CancellationToken.None));
    }

    [Fact]
    public async Task Handle_SessionCompleted_ThrowsInvalidOperationException()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var repository = new EfUploadRepository(dbContext, Mock.Of<MediatR.IMediator>());

        var session = new UploadSession(
            sessionId: "completed-session",
            fileName: FileName.Create("doc.pdf"),
            fileExtension: FileExtension.Create("pdf"),
            mimeType: MimeType.Create("application/pdf"),
            fileSize: FileSize.Create(1024),
            chunkSize: 1024);
        session.Start();
        session.InitializeChunks();
        session.Chunks.First().MarkCompleted();
        session.Complete("uploads/key");
        await repository.AddAsync(session);
        await repository.SaveChangesAsync();

        var handler = new CancelUploadCommandHandler(repository);

        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            handler.Handle(new CancelUploadCommand(session.Id), CancellationToken.None));
    }
}

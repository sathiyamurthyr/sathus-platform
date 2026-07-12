using Moq;
using Sathus.Upload.Application.Commands.ResumeUpload;
using Sathus.Upload.Domain.Entities;
using Sathus.Upload.Infrastructure.Persistence;
using Sathus.Upload.Infrastructure.Repositories;
using Sathus.Upload.Tests.Infrastructure;
using Xunit;

namespace Sathus.Upload.Tests.Application.Commands;

public class ResumeUploadCommandHandlerTests
{
    [Fact]
    public async Task Handle_ValidPausedSession_ReturnsResumedSession()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var repository = new EfUploadRepository(dbContext, Mock.Of<MediatR.IMediator>());

        var session = new UploadSession(
            sessionId: "resume-session",
            fileName: FileName.Create("doc.pdf"),
            fileExtension: FileExtension.Create("pdf"),
            mimeType: MimeType.Create("application/pdf"),
            fileSize: FileSize.Create(1024),
            chunkSize: 1024);
        session.Start();
        session.Pause();
        await repository.AddAsync(session);
        await repository.SaveChangesAsync();

        var handler = new ResumeUploadCommandHandler(repository);
        var result = await handler.Handle(new ResumeUploadCommand(session.Id, Guid.NewGuid()), CancellationToken.None);

        result.Status.Should().Be("Uploading");
    }

    [Fact]
    public async Task Handle_InvalidSession_ThrowsNotFoundException()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var repository = new EfUploadRepository(dbContext, Mock.Of<MediatR.IMediator>());

        var handler = new ResumeUploadCommandHandler(repository);

        await Assert.ThrowsAsync<UploadSessionNotFoundException>(() =>
            handler.Handle(new ResumeUploadCommand(Guid.NewGuid()), CancellationToken.None));
    }

    [Fact]
    public async Task Handle_NonPausedSession_ThrowsInvalidOperationException()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var repository = new EfUploadRepository(dbContext, Mock.Of<MediatR.IMediator>());

        var session = new UploadSession(
            sessionId: "non-paused-session",
            fileName: FileName.Create("doc.pdf"),
            fileExtension: FileExtension.Create("pdf"),
            mimeType: MimeType.Create("application/pdf"),
            fileSize: FileSize.Create(1024),
            chunkSize: 1024);
        session.Start();
        await repository.AddAsync(session);
        await repository.SaveChangesAsync();

        var handler = new ResumeUploadCommandHandler(repository);

        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            handler.Handle(new ResumeUploadCommand(session.Id), CancellationToken.None));
    }
}

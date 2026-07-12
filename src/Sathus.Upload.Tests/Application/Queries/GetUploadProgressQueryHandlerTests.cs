using Sathus.Upload.Tests.Infrastructure;
using Xunit;

namespace Sathus.Upload.Tests.Application.Queries;

public class GetUploadProgressQueryHandlerTests
{
    [Fact]
    public async Task Handle_ReturnsProgress()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var repository = new Sathus.Upload.Infrastructure.Repositories.EfUploadRepository(dbContext, Mock.Of<MediatR.IMediator>());

        var session = new Sathus.Upload.Domain.Entities.UploadSession(
            sessionId: "progress-test",
            fileName: FileName.Create("doc.pdf"),
            fileExtension: FileExtension.Create("pdf"),
            mimeType: MimeType.Create("application/pdf"),
            fileSize: FileSize.Create(2048),
            chunkSize: 1024);
        session.InitializeChunks();
        session.Start();
        session.MarkChunkCompleted(0);
        await repository.AddAsync(session);
        await repository.SaveChangesAsync();

        var handler = new Sathus.Upload.Application.Queries.GetUploadProgress.GetUploadProgressQueryHandler(repository);
        var result = await handler.Handle(new Sathus.Upload.Application.Queries.GetUploadProgress.GetUploadProgressQuery(session.Id), CancellationToken.None);

        result.UploadedChunks.Should().Be(1);
        result.TotalChunks.Should().Be(2);
        result.Progress.Should().BeApproximately(50, 0.01);
    }

    [Fact]
    public async Task Handle_SessionNotFound_ThrowsNotFoundException()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var repository = new Sathus.Upload.Infrastructure.Repositories.EfUploadRepository(dbContext, Mock.Of<MediatR.IMediator>());

        var handler = new Sathus.Upload.Application.Queries.GetUploadProgress.GetUploadProgressQueryHandler(repository);

        await Assert.ThrowsAsync<UploadSessionNotFoundException>(() =>
            handler.Handle(new Sathus.Upload.Application.Queries.GetUploadProgress.GetUploadProgressQuery(Guid.NewGuid()), CancellationToken.None));
    }

    [Fact]
    public async Task Handle_NoChunks_ReturnsZeroProgress()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var repository = new Sathus.Upload.Infrastructure.Repositories.EfUploadRepository(dbContext, Mock.Of<MediatR.IMediator>());

        var session = new Sathus.Upload.Domain.Entities.UploadSession(
            sessionId: "no-chunks-session",
            fileName: FileName.Create("doc.pdf"),
            fileExtension: FileExtension.Create("pdf"),
            mimeType: MimeType.Create("application/pdf"),
            fileSize: FileSize.Create(1024),
            chunkSize: 1024);
        session.InitializeChunks();
        session.Start();
        await repository.AddAsync(session);
        await repository.SaveChangesAsync();

        var handler = new Sathus.Upload.Application.Queries.GetUploadProgress.GetUploadProgressQueryHandler(repository);
        var result = await handler.Handle(new Sathus.Upload.Application.Queries.GetUploadProgress.GetUploadProgressQuery(session.Id), CancellationToken.None);

        result.UploadedChunks.Should().Be(0);
        result.TotalChunks.Should().Be(1);
        result.Progress.Should().Be(0);
    }

    [Fact]
    public async Task Handle_MixedChunks_ReturnsCorrectBytesUploaded()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var repository = new Sathus.Upload.Infrastructure.Repositories.EfUploadRepository(dbContext, Mock.Of<MediatR.IMediator>());

        var session = new Sathus.Upload.Domain.Entities.UploadSession(
            sessionId: "mixed-chunks-session",
            fileName: FileName.Create("doc.pdf"),
            fileExtension: FileExtension.Create("pdf"),
            mimeType: MimeType.Create("application/pdf"),
            fileSize: FileSize.Create(4096),
            chunkSize: 1024);
        session.InitializeChunks();
        session.Start();
        session.MarkChunkCompleted(0);
        session.MarkChunkCompleted(2);
        await repository.AddAsync(session);
        await repository.SaveChangesAsync();

        var handler = new Sathus.Upload.Application.Queries.GetUploadProgress.GetUploadProgressQueryHandler(repository);
        var result = await handler.Handle(new Sathus.Upload.Application.Queries.GetUploadProgress.GetUploadProgressQuery(session.Id), CancellationToken.None);

        result.UploadedChunks.Should().Be(2);
        result.TotalChunks.Should().Be(4);
        result.Progress.Should().BeApproximately(50, 0.01);
    }
}

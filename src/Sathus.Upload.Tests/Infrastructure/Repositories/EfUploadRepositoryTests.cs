using Microsoft.EntityFrameworkCore;
using Sathus.Upload.Infrastructure.Persistence;
using Sathus.Upload.Infrastructure.Repositories;
using Xunit;

namespace Sathus.Upload.Tests.Infrastructure.Repositories;

public class EfUploadRepositoryTests
{
    [Fact]
    public async Task AddAsync_NewSession_Persists()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var repository = new EfUploadRepository(dbContext, Mock.Of<MediatR.IMediator>());

        var session = new Sathus.Upload.Domain.Entities.UploadSession(
            sessionId: "repo-test",
            fileName: FileName.Create("test.pdf"),
            fileExtension: FileExtension.Create("pdf"),
            mimeType: MimeType.Create("application/pdf"),
            fileSize: FileSize.Create(1024),
            chunkSize: 512);
        session.InitializeChunks();

        await repository.AddAsync(session);
        await repository.SaveChangesAsync();

        var retrieved = await repository.GetBySessionIdAsync("repo-test");
        retrieved.Should().NotBeNull();
        retrieved!.FileName.Value.Should().Be("test.pdf");
    }

    [Fact]
    public async Task GetBySessionIdAsync_ExistingSession_ReturnsSessionWithChunks()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var repository = new EfUploadRepository(dbContext, Mock.Of<MediatR.IMediator>());

        var session = new Sathus.Upload.Domain.Entities.UploadSession(
            sessionId: "chunk-repo-test",
            fileName: FileName.Create("test.pdf"),
            fileExtension: FileExtension.Create("pdf"),
            mimeType: MimeType.Create("application/pdf"),
            fileSize: FileSize.Create(1024),
            chunkSize: 512);
        session.InitializeChunks();
        await repository.AddAsync(session);
        await repository.SaveChangesAsync();

        var retrieved = await repository.GetBySessionIdAsync("chunk-repo-test");
        retrieved.Should().NotBeNull();
        retrieved!.Chunks.Should().HaveCount(2);
    }
}

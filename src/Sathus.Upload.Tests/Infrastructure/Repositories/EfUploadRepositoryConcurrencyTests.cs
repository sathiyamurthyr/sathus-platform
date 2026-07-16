using Sathus.Media.Domain.ValueObjects;
using Sathus.Upload.Domain.Entities;
using Sathus.Upload.Infrastructure.Repositories;
using Sathus.Upload.Tests.Infrastructure;

namespace Sathus.Upload.Tests.Infrastructure.Repositories;

public class EfUploadRepositoryConcurrencyTests
{
    private static UploadSession CreateSession(string sessionId, Guid? createdBy = null)
    {
        return new UploadSession(
            sessionId: sessionId,
            fileName: FileName.Create("video.mp4"),
            fileExtension: FileExtension.Create("mp4"),
            mimeType: MimeType.Create("video/mp4"),
            fileSize: FileSize.Create(1024),
            chunkSize: 512,
            createdBy: createdBy);
    }

    [Fact]
    public async Task Concurrency_SaveChanges_DispatchesDomainEvents()
    {
        var mediator = new Mock<IMediator>();
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var repository = new EfUploadRepository(dbContext, mediator.Object);

        var session = CreateSession("dispatch-session");
        await repository.AddAsync(session);
        session.Start();

        await repository.SaveChangesAsync();

        mediator.Verify(
            m => m.Publish(It.IsAny<INotification>(), It.IsAny<CancellationToken>()),
            Times.AtLeastOnce);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsAllSessions()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var repository = new EfUploadRepository(dbContext, Mock.Of<IMediator>());

        await repository.AddAsync(CreateSession("all-1"));
        await repository.AddAsync(CreateSession("all-2"));
        await repository.AddAsync(CreateSession("all-3"));
        await repository.SaveChangesAsync();

        var result = await repository.GetAllAsync();

        result.Should().HaveCount(3);
    }

    [Fact]
    public async Task GetActiveSessionsAsync_ReturnsOnlyActive()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var repository = new EfUploadRepository(dbContext, Mock.Of<IMediator>());

        var uploading = CreateSession("active-uploading");
        uploading.Start();

        var paused = CreateSession("active-paused");
        paused.Start();
        paused.Pause();

        var completed = CreateSession("inactive-completed");
        completed.Start();
        completed.Complete("uploads/completed.mp4");

        var failed = CreateSession("inactive-failed");
        failed.Start();
        failed.Fail("boom");

        await repository.AddAsync(uploading);
        await repository.AddAsync(paused);
        await repository.AddAsync(completed);
        await repository.AddAsync(failed);
        await repository.SaveChangesAsync();

        var result = await repository.GetActiveSessionsAsync();

        result.Should().HaveCount(2);
        result.Select(s => s.SessionId).Should().Contain(new[] { "active-uploading", "active-paused" });
    }

    [Fact]
    public async Task GetByCreatedByAsync_ReturnsUserSessions()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var repository = new EfUploadRepository(dbContext, Mock.Of<IMediator>());

        var owner = Guid.NewGuid();
        var other = Guid.NewGuid();

        await repository.AddAsync(CreateSession("owner-1", owner));
        await repository.AddAsync(CreateSession("owner-2", owner));
        await repository.AddAsync(CreateSession("other-1", other));
        await repository.SaveChangesAsync();

        var result = await repository.GetByCreatedByAsync(owner);

        result.Should().HaveCount(2);
        result.Select(s => s.SessionId).Should().Contain(new[] { "owner-1", "owner-2" });
    }
}

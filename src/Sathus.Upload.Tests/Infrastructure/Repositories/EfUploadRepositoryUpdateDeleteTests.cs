using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using MediatR;
using Moq;
using Sathus.Media.Domain.ValueObjects;
using Sathus.SharedKernel.Specifications;
using Sathus.Upload.Domain.Entities;
using Sathus.Upload.Infrastructure.Persistence;
using Sathus.Upload.Infrastructure.Repositories;
using Sathus.Upload.Tests.Infrastructure;
using Xunit;

namespace Sathus.Upload.Tests.Infrastructure.Repositories;

public class EfUploadRepositoryUpdateDeleteTests
{
    [Fact]
    public async Task UpdateAsync_ExistingSession_UpdatesEntity()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var mediator = Mock.Of<IMediator>();
        var repository = new EfUploadRepository(dbContext, mediator);

        var session = new UploadSession(
            sessionId: "update-test",
            fileName: FileName.Create("test.pdf"),
            fileExtension: FileExtension.Create("pdf"),
            mimeType: MimeType.Create("application/pdf"),
            fileSize: FileSize.Create(1024),
            chunkSize: 512);
        session.InitializeChunks();
        await repository.AddAsync(session);
        await repository.SaveChangesAsync();

        session.Fail("something went wrong");
        await repository.UpdateAsync(session);
        await repository.SaveChangesAsync();

        var retrieved = await repository.GetBySessionIdAsync("update-test");
        retrieved.Should().NotBeNull();
        retrieved!.ErrorMessage.Should().Be("something went wrong");
        retrieved.Status.Should().Be(Upload.Domain.Enums.UploadStatus.Failed);
    }

    [Fact]
    public async Task DeleteAsync_ExistingSession_RemovesEntity()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var mediator = Mock.Of<IMediator>();
        var repository = new EfUploadRepository(dbContext, mediator);

        var session = new UploadSession(
            sessionId: "delete-test",
            fileName: FileName.Create("test.pdf"),
            fileExtension: FileExtension.Create("pdf"),
            mimeType: MimeType.Create("application/pdf"),
            fileSize: FileSize.Create(1024),
            chunkSize: 512);
        session.InitializeChunks();
        await repository.AddAsync(session);
        await repository.SaveChangesAsync();

        await repository.DeleteAsync(session);
        await repository.SaveChangesAsync();

        var retrieved = await repository.GetBySessionIdAsync("delete-test");
        retrieved.Should().BeNull();
        (await repository.ExistsAsync(session.Id)).Should().BeFalse();
    }

    [Fact]
    public async Task ExistsAsync_ExistingSession_ReturnsTrue()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var mediator = Mock.Of<IMediator>();
        var repository = new EfUploadRepository(dbContext, mediator);

        var session = new UploadSession(
            sessionId: "exists-test",
            fileName: FileName.Create("test.pdf"),
            fileExtension: FileExtension.Create("pdf"),
            mimeType: MimeType.Create("application/pdf"),
            fileSize: FileSize.Create(1024),
            chunkSize: 512);
        session.InitializeChunks();
        await repository.AddAsync(session);
        await repository.SaveChangesAsync();

        var exists = await repository.ExistsAsync(session.Id);

        exists.Should().BeTrue();
    }

    [Fact]
    public async Task ExistsAsync_NonExistingSession_ReturnsFalse()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var mediator = Mock.Of<IMediator>();
        var repository = new EfUploadRepository(dbContext, mediator);

        var exists = await repository.ExistsAsync(Guid.NewGuid());

        exists.Should().BeFalse();
    }

    [Fact]
    public async Task CountAsync_ReturnsCount()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var mediator = Mock.Of<IMediator>();
        var repository = new EfUploadRepository(dbContext, mediator);

        for (var i = 0; i < 3; i++)
        {
            var session = new UploadSession(
                sessionId: $"count-test-{i}",
                fileName: FileName.Create("test.pdf"),
                fileExtension: FileExtension.Create("pdf"),
                mimeType: MimeType.Create("application/pdf"),
                fileSize: FileSize.Create(1024),
                chunkSize: 512);
            session.InitializeChunks();
            await repository.AddAsync(session);
        }

        await repository.SaveChangesAsync();

        var count = await repository.CountAsync(new AllUploadSessionsSpecification());
        count.Should().Be(3);
    }

    private sealed class AllUploadSessionsSpecification : Specification<UploadSession>
    {
        public AllUploadSessionsSpecification() => AddCriteria(_ => true);
    }

    [Fact]
    public async Task AnyAsync_ExistingSession_ReturnsTrue()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var mediator = Mock.Of<IMediator>();
        var repository = new EfUploadRepository(dbContext, mediator);

        var session = new UploadSession(
            sessionId: "any-test",
            fileName: FileName.Create("test.pdf"),
            fileExtension: FileExtension.Create("pdf"),
            mimeType: MimeType.Create("application/pdf"),
            fileSize: FileSize.Create(1024),
            chunkSize: 512);
        session.InitializeChunks();
        await repository.AddAsync(session);
        await repository.SaveChangesAsync();

        var any = await repository.AnyAsync(new UploadSessionByIdSpecification(session.Id));

        any.Should().BeTrue();
    }

    private sealed class UploadSessionByIdSpecification : Specification<UploadSession>
    {
        public UploadSessionByIdSpecification(Guid id) => AddCriteria(s => s.Id == id);
    }

    [Fact]
    public async Task AddAsync_NullThrows()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var mediator = Mock.Of<IMediator>();
        var repository = new EfUploadRepository(dbContext, mediator);

        var act = async () => await repository.AddAsync(null!);

        await act.Should().ThrowAsync<ArgumentNullException>();
    }

    [Fact]
    public async Task DeleteAsync_NullThrows()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var mediator = Mock.Of<IMediator>();
        var repository = new EfUploadRepository(dbContext, mediator);

        var act = () => repository.DeleteAsync(null!);

        await act.Should().ThrowAsync<ArgumentNullException>();
    }

    [Fact]
    public async Task SaveChangesAsync_DispatchesEvents_WithCompletedSession()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var mediator = new Mock<IMediator>();
        var repository = new EfUploadRepository(dbContext, mediator.Object);

        var session = new UploadSession(
            sessionId: "dispatch-test",
            fileName: FileName.Create("test.pdf"),
            fileExtension: FileExtension.Create("pdf"),
            mimeType: MimeType.Create("application/pdf"),
            fileSize: FileSize.Create(1024),
            chunkSize: 512);
        session.InitializeChunks();
        await repository.AddAsync(session);
        await repository.SaveChangesAsync();

        session.Start();
        session.Complete("uploads/dispatch-test/test.pdf");
        await repository.SaveChangesAsync();

        mediator.Verify(
            m => m.Publish(It.IsAny<INotification>(), It.IsAny<CancellationToken>()),
            Times.AtLeastOnce);
    }
}

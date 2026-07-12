using Moq;
using Sathus.Upload.Application.Interfaces;
using Sathus.Upload.Application.Queries.GetUploadSession;
using Sathus.Upload.Domain.Entities;
using Sathus.Upload.Domain.Exceptions;
using Sathus.Upload.Infrastructure.Persistence;
using Sathus.Upload.Infrastructure.Repositories;
using Sathus.Upload.Tests.Infrastructure;
using Xunit;

namespace Sathus.Upload.Tests.Application.Queries;

public class GetUploadSessionQueryHandlerTests
{
    [Fact]
    public async Task Handle_ExistingSession_ReturnsSession()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var repository = new EfUploadRepository(dbContext, Mock.Of<MediatR.IMediator>());

        var session = new UploadSession(
            sessionId: "query-test",
            fileName: FileName.Create("doc.pdf"),
            fileExtension: FileExtension.Create("pdf"),
            mimeType: MimeType.Create("application/pdf"),
            fileSize: FileSize.Create(1024),
            chunkSize: 512);
        await repository.AddAsync(session);
        await repository.SaveChangesAsync();

        var handler = new GetUploadSessionQueryHandler(repository);
        var result = await handler.Handle(new GetUploadSessionQuery(session.Id), CancellationToken.None);

        result.SessionId.Should().Be("query-test");
        result.FileName.Should().Be("doc.pdf");
    }

    [Fact]
    public async Task Handle_NonExistingSession_ThrowsNotFoundException()
    {
        var handler = new GetUploadSessionQueryHandler(new Mock<IUploadRepository>().Object);
        await Assert.ThrowsAsync<UploadSessionNotFoundException>(() => handler.Handle(new GetUploadSessionQuery(Guid.NewGuid()), CancellationToken.None));
    }
}

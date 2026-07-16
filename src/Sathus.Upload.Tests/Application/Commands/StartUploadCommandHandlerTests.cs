using Moq;
using Sathus.Media.Domain.ValueObjects;
using Sathus.Storage.Domain.ValueObjects;
using Sathus.Upload.Application.Commands.StartUpload;
using Sathus.Upload.Application.Interfaces;
using Sathus.Upload.Domain.Entities;
using Sathus.Upload.Infrastructure.Persistence;
using Sathus.Upload.Infrastructure.Repositories;
using Sathus.Upload.Tests.Infrastructure;
using Xunit;

namespace Sathus.Upload.Tests.Application.Commands;

public class StartUploadCommandHandlerTests
{
    [Fact]
    public async Task Handle_ValidCommand_CreatesSessionAndReturnsResponse()
    {
        await using var dbContext = InMemoryUploadContextFactory.Create();
        var repository = new EfUploadRepository(dbContext, Mock.Of<MediatR.IMediator>());
        var validator = new Mock<IUploadValidator>();
        validator.Setup(v => v.ValidateAsync(It.IsAny<UploadSession>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        var handler = new StartUploadCommandHandler(repository, validator.Object, Mock.Of<MediatR.IMediator>());

        var command = new StartUploadCommand(
            "report.pdf",
            "pdf",
            "application/pdf",
            5 * 1024 * 1024,
            ChunkSize: 1024 * 1024,
            ActorId: Guid.NewGuid());

        var result = await handler.Handle(command, CancellationToken.None);

        result.FileName.Should().Be("report.pdf");
        result.Status.Should().Be("Pending");
        result.TotalChunks.Should().Be(5);
    }
}

using Moq;
using Sathus.Media.Application.Commands.CreateMediaAsset;
using Sathus.Media.Application.Interfaces;

namespace Sathus.Media.Tests.Application.Commands;

public class CreateMediaAssetCommandHandlerTests
{
    [Fact]
    public async Task Handle_ValidCommand_CreatesAssetAndReturnsResponse()
    {
        var repository = new Mock<IMediaRepository>();
        var search = new Mock<IMediaSearchProvider>();
        var audit = new Mock<IMediaAuditService>();

        MediaAsset? captured = null;
        repository.Setup(r => r.AddAsync(It.IsAny<MediaAsset>(), It.IsAny<CancellationToken>()))
            .Callback<MediaAsset, CancellationToken>((a, _) => captured = a)
            .Returns(Task.CompletedTask);
        repository.Setup(r => r.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);

        var handler = new CreateMediaAssetCommandHandler(repository.Object, search.Object, audit.Object);

        var command = new CreateMediaAssetCommand(
            "photo.png", "png", "image/png", 1024, "sha256:abc",             "images/photo.png", "image", "en",
            Width: 800, Height: 600, ActorId: Guid.NewGuid());

        var result = await handler.Handle(command, CancellationToken.None);

        result.FileName.Should().Be("photo.png");
        result.Type.Should().Be("image");
        result.Status.Should().Be("Draft");
        captured.Should().NotBeNull();
        captured!.Dimensions!.Width.Should().Be(800);
        repository.Verify(r => r.AddAsync(It.IsAny<MediaAsset>(), It.IsAny<CancellationToken>()), Times.Once);
        repository.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        search.Verify(s => s.IndexAsync(It.IsAny<MediaAsset>(), It.IsAny<CancellationToken>()), Times.Once);
        audit.Verify(a => a.LogAsync(It.IsAny<MediaAuditEntry>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_FutureMediaType_Succeeds()
    {
        var repository = new Mock<IMediaRepository>();
        repository.Setup(r => r.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);

        var handler = new CreateMediaAssetCommandHandler(
            repository.Object, Mock.Of<IMediaSearchProvider>(), Mock.Of<IMediaAuditService>());

        var result = await handler.Handle(new CreateMediaAssetCommand(
            "x.hol", "hol", "application/x-hologram", 1024, "sha256:abc", "i/x.hol", "hologram", "en",
            Width: 1, Height: 1), CancellationToken.None);

        result.Type.Should().Be("hologram");
    }
}

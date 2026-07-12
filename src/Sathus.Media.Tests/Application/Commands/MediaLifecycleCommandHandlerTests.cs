using Moq;
using Sathus.Media.Application.Commands.ArchiveMedia;
using Sathus.Media.Application.Commands.DeleteMedia;
using Sathus.Media.Application.Commands.RestoreMedia;
using Sathus.Media.Application.Commands.UpdateMediaMetadata;
using Sathus.Media.Application.Interfaces;
using Sathus.Media.Application.Specifications;
using Sathus.Media.Domain.Exceptions;

namespace Sathus.Media.Tests.Application.Commands;

public class MediaLifecycleCommandHandlerTests
{
    private static MediaAsset ReadyAsset() =>
        MediaAsset.Create(
            FileName.Create("a.png"), FileExtension.Create("png"), MimeType.Create("image/png"),
            FileSize.Create(10), Checksum.Create("sha256:abc"), StorageKey.Create("i/a.png"),
            MediaType.Image, LanguageCode.Create("en"), initialStatus: MediaStatus.Ready,
            dimensions: ImageDimensions.Create(1, 1));

    [Fact]
    public async Task UpdateMetadata_UpdatesAndPersists()
    {
        var asset = ReadyAsset();
        var repository = new Mock<IMediaRepository>();
        repository.Setup(r => r.GetSingleAsync(It.IsAny<MediaAssetDetailSpecification>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(asset);
        repository.Setup(r => r.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);

        var handler = new UpdateMediaMetadataCommandHandler(repository.Object, Mock.Of<IMediaAuditService>());
        var result = await handler.Handle(new UpdateMediaMetadataCommand(asset.Id, "alt", "es", "T", "D", null, Guid.NewGuid()), CancellationToken.None);

        result.AltText.Should().Be("alt");
        result.Title.Should().Be("T");
        repository.Verify(r => r.UpdateAsync(It.IsAny<MediaAsset>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task UpdateMetadata_NotFound_Throws()
    {
        var repository = new Mock<IMediaRepository>();
        repository.Setup(r => r.GetSingleAsync(It.IsAny<MediaAssetDetailSpecification>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((MediaAsset?)null);

        var handler = new UpdateMediaMetadataCommandHandler(repository.Object, Mock.Of<IMediaAuditService>());
        var act = async () => await handler.Handle(new UpdateMediaMetadataCommand(Guid.NewGuid()), CancellationToken.None);
        await act.Should().ThrowAsync<MediaAssetNotFoundException>();
    }

    [Fact]
    public async Task Archive_Persists()
    {
        var asset = ReadyAsset();
        var repository = new Mock<IMediaRepository>();
        repository.Setup(r => r.GetSingleAsync(It.IsAny<MediaAssetDetailSpecification>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(asset);
        repository.Setup(r => r.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);

        await new ArchiveMediaCommandHandler(repository.Object, Mock.Of<IMediaAuditService>())
            .Handle(new ArchiveMediaCommand(asset.Id), CancellationToken.None);

        asset.Status.Should().Be(MediaStatus.Archived);
    }

    [Fact]
    public async Task Delete_PersistsAndIndexesRemoval()
    {
        var asset = ReadyAsset();
        var repository = new Mock<IMediaRepository>();
        var search = new Mock<IMediaSearchProvider>();
        repository.Setup(r => r.GetSingleAsync(It.IsAny<MediaAssetDetailSpecification>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(asset);
        repository.Setup(r => r.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);

        await new DeleteMediaCommandHandler(repository.Object, search.Object, Mock.Of<IMediaAuditService>())
            .Handle(new DeleteMediaCommand(asset.Id), CancellationToken.None);

        asset.Status.Should().Be(MediaStatus.Deleted);
        search.Verify(s => s.RemoveAsync(asset.Id, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Restore_Persists()
    {
        var asset = ReadyAsset();
        asset.Delete(Guid.NewGuid());
        var repository = new Mock<IMediaRepository>();
        repository.Setup(r => r.GetSingleAsync(It.IsAny<MediaAssetDetailSpecification>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(asset);
        repository.Setup(r => r.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);

        await new RestoreMediaCommandHandler(repository.Object, Mock.Of<IMediaAuditService>())
            .Handle(new RestoreMediaCommand(asset.Id), CancellationToken.None);

        asset.Status.Should().Be(MediaStatus.Ready);
        asset.IsDeleted.Should().BeFalse();
    }
}

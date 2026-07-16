using MediatR;

namespace Sathus.Media.Tests.Domain;

public class MediaAssetTests
{
    private static MediaAsset CreateDocument(MediaStatus status = MediaStatus.Draft, Guid? ownerId = null)
    {
        return MediaAsset.Create(
            FileName.Create("report.pdf"),
            FileExtension.Create("pdf"),
            MimeType.Create("application/pdf"),
            FileSize.Create(2048),
            Checksum.Create("sha256:abc123"),
            StorageKey.Create("documents/report.pdf"),
            MediaType.Document,
            LanguageCode.Create("en"),
            ownerId: ownerId,
            initialStatus: status);
    }

    [Fact]
    public void Create_SetsDefaultsAndRaisesEvent()
    {
        var asset = CreateDocument();

        asset.Id.Should().NotBe(Guid.Empty);
        asset.Status.Should().Be(MediaStatus.Draft);
        asset.FileName.Value.Should().Be("report.pdf");
        asset.MediaId.Value.Should().Be(asset.Id);
        asset.DomainEvents.Should().ContainSingle(e => e is MediaCreatedEvent);
        asset.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
    }

    [Fact]
    public void Create_UnknownFutureType_IsAccepted()
    {
        var asset = MediaAsset.Create(
            FileName.Create("holo.hol"),
            FileExtension.Create("hol"),
            MimeType.Create("application/x-hologram"),
            FileSize.Create(1024),
            Checksum.Create("sha256:deadbeef"),
            StorageKey.Create("future/holo.hol"),
            MediaType.Create("hologram"),
            LanguageCode.Create("en"),
            dimensions: ImageDimensions.Create(10, 10));

        asset.Type.Value.Should().Be("hologram");
        asset.Type.IsKnown.Should().BeFalse();
    }

    [Fact]
    public void Create_ImageRequiresDimensions()
    {
        var act = () => MediaAsset.Create(
            FileName.Create("photo.png"),
            FileExtension.Create("png"),
            MimeType.Create("image/png"),
            FileSize.Create(1024),
            Checksum.Create("sha256:abc"),
            StorageKey.Create("images/photo.png"),
            MediaType.Image,
            LanguageCode.Create("en"));

        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Create_ImageWithDimensions_Succeeds()
    {
        var asset = MediaAsset.Create(
            FileName.Create("photo.png"),
            FileExtension.Create("png"),
            MimeType.Create("image/png"),
            FileSize.Create(1024),
            Checksum.Create("sha256:abc"),
            StorageKey.Create("images/photo.png"),
            MediaType.Image,
            LanguageCode.Create("en"),
            dimensions: ImageDimensions.Create(800, 600));

        asset.Dimensions!.Width.Should().Be(800);
        asset.Dimensions.Height.Should().Be(600);
    }

    [Fact]
    public void Create_AudioRequiresDuration()
    {
        var act = () => MediaAsset.Create(
            FileName.Create("song.mp3"),
            FileExtension.Create("mp3"),
            MimeType.Create("audio/mpeg"),
            FileSize.Create(1024),
            Checksum.Create("sha256:abc"),
            StorageKey.Create("audio/song.mp3"),
            MediaType.Audio,
            LanguageCode.Create("en"));

        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void UpdateMetadata_UpdatesFieldsAndRaisesEvent()
    {
        var asset = CreateDocument();

        asset.UpdateMetadata(
            AltText.Create("A report"),
            LanguageCode.Create("es"),
            "Mi Reporte",
            "Desc",
            folderId: Guid.NewGuid(),
            updatedBy: Guid.NewGuid());

        asset.AltText!.Value.Should().Be("A report");
        asset.Language.Value.Should().Be("es");
        asset.Title.Should().Be("Mi Reporte");
        asset.DomainEvents.Should().ContainSingle(e => e is MediaUpdatedEvent);
    }

    [Fact]
    public void Archive_SetsStatusAndRaisesEvent()
    {
        var asset = CreateDocument(MediaStatus.Ready);

        asset.Archive(Guid.NewGuid());

        asset.Status.Should().Be(MediaStatus.Archived);
        asset.DomainEvents.Should().ContainSingle(e => e is MediaArchivedEvent);
    }

    [Fact]
    public void Delete_SoftDeletesAndRaisesEvent()
    {
        var asset = CreateDocument();

        asset.Delete(Guid.NewGuid());

        asset.Status.Should().Be(MediaStatus.Deleted);
        asset.IsDeleted.Should().BeTrue();
        asset.DeletedAt.Should().NotBeNull();
        asset.DomainEvents.Should().ContainSingle(e => e is MediaDeletedEvent);
    }

    [Fact]
    public void Restore_ReturnsToReadyAndRaisesEvent()
    {
        var asset = CreateDocument();
        asset.Delete(Guid.NewGuid());

        asset.Restore(Guid.NewGuid());

        asset.Status.Should().Be(MediaStatus.Ready);
        asset.IsDeleted.Should().BeFalse();
        asset.DomainEvents.Should().ContainSingle(e => e is MediaRestoredEvent);
    }

    [Fact]
    public void Restore_WhenNotDeleted_Throws()
    {
        var asset = CreateDocument();
        var act = () => asset.Restore(Guid.NewGuid());
        act.Should().Throw<InvalidMediaStatusTransitionException>();
    }

    [Fact]
    public void Edit_AfterDelete_Throws()
    {
        var asset = CreateDocument();
        asset.Delete(Guid.NewGuid());

        var act = () => asset.UpdateMetadata(
            AltText.Create("x"), LanguageCode.Create("en"), null, null, null, Guid.NewGuid());

        act.Should().Throw<InvalidMediaStatusTransitionException>();
    }

    [Fact]
    public void MarkProcessing_Ready_And_Archive_Workflow()
    {
        var asset = CreateDocument();
        asset.MarkProcessing(Guid.NewGuid());
        asset.Status.Should().Be(MediaStatus.Processing);

        asset.MarkReady(Guid.NewGuid());
        asset.Status.Should().Be(MediaStatus.Ready);

        asset.Archive(Guid.NewGuid());
        asset.Status.Should().Be(MediaStatus.Archived);
    }
}

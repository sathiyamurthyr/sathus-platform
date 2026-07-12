using Sathus.Media.Tests.Infrastructure;

namespace Sathus.Media.Tests.Infrastructure.Repositories;

public class EfMediaRepositoryTests
{
    private static MediaAsset MakeAsset(string name, MediaType type, Guid? folderId = null, string checksum = "sha256:abcdef01")
    {
        return MediaAsset.Create(
            FileName.Create(name),
            FileExtension.Create("png"),
            MimeType.Create("image/png"),
            FileSize.Create(1024),
            Checksum.Create(checksum),
            StorageKey.Create($"img/{name}"),
            type,
            LanguageCode.Create("en"),
            folderId: folderId,
            dimensions: ImageDimensions.Create(10, 10));
    }

    private static EfMediaRepository CreateRepository(MediaDbContext db, IMediator mediator) => new(db, mediator);

    [Fact]
    public async Task Add_And_GetById_PersistsAndReads()
    {
        using var db = InMemoryMediaContextFactory.Create();
        var repo = CreateRepository(db, new Mock<IMediator>().Object);

        var asset = MakeAsset("a.png", MediaType.Image);
        await repo.AddAsync(asset);
        await repo.SaveChangesAsync();

        var loaded = await repo.GetByIdAsync(asset.Id);
        loaded.Should().NotBeNull();
        loaded!.FileName.Value.Should().Be("a.png");
    }

    [Fact]
    public async Task SoftDelete_HidesFromGetById()
    {
        using var db = InMemoryMediaContextFactory.Create();
        var repo = CreateRepository(db, new Mock<IMediator>().Object);

        var asset = MakeAsset("b.png", MediaType.Image);
        await repo.AddAsync(asset);
        await repo.SaveChangesAsync();

        await repo.DeleteAsync(asset);
        await repo.SaveChangesAsync();

        (await repo.GetByIdAsync(asset.Id)).Should().BeNull();
        (await repo.ExistsAsync(asset.Id)).Should().BeFalse();
    }

    [Fact]
    public async Task GetByFolderId_ReturnsMatchingAssets()
    {
        using var db = InMemoryMediaContextFactory.Create();
        var repo = CreateRepository(db, new Mock<IMediator>().Object);

        var folder = Guid.NewGuid();
        await repo.AddAsync(MakeAsset("f1.png", MediaType.Image, folder));
        await repo.AddAsync(MakeAsset("f2.png", MediaType.Image, folder));
        await repo.AddAsync(MakeAsset("other.png", MediaType.Image, Guid.NewGuid()));
        await repo.SaveChangesAsync();

        var result = await repo.GetByFolderIdAsync(folder);
        result.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetByChecksum_ReturnsMatches()
    {
        using var db = InMemoryMediaContextFactory.Create();
        var repo = CreateRepository(db, new Mock<IMediator>().Object);

        await repo.AddAsync(MakeAsset("c1.png", MediaType.Image, checksum: "sha256:deadbeef"));
        await repo.AddAsync(MakeAsset("c2.png", MediaType.Image, checksum: "sha256:deadbeef"));
        await repo.SaveChangesAsync();

        var result = await repo.GetByChecksumAsync(Checksum.Create("sha256:deadbeef"));
        result.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetAsync_WithSpecification_AppliesFilterAndPaging()
    {
        using var db = InMemoryMediaContextFactory.Create();
        var repo = CreateRepository(db, new Mock<IMediator>().Object);

        for (var i = 0; i < 5; i++)
        {
            await repo.AddAsync(MakeAsset($"img{i}.png", MediaType.Image));
        }
        await repo.SaveChangesAsync();

        var spec = new MediaAssetFilterSpecification(skip: 0, take: 2);
        var items = await repo.GetAsync(spec);
        items.Should().HaveCount(2);

        var total = await repo.CountAsync(new MediaAssetFilterSpecification());
        total.Should().Be(5);
    }

    [Fact]
    public async Task SaveChanges_DispatchesDomainEvents()
    {
        using var db = InMemoryMediaContextFactory.Create();
        var mediator = new Mock<IMediator>(MockBehavior.Loose);
        mediator.Setup(m => m.Publish(It.IsAny<INotification>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        var repo = CreateRepository(db, mediator.Object);

        await repo.AddAsync(MakeAsset("evt.png", MediaType.Image));
        await repo.SaveChangesAsync();

        mediator.Verify(m => m.Publish(It.IsAny<INotification>(), It.IsAny<CancellationToken>()), Times.Once);
    }
}

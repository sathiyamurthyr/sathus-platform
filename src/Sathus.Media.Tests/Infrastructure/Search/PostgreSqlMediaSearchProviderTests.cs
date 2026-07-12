using Sathus.Media.Tests.Infrastructure;

namespace Sathus.Media.Tests.Infrastructure.Search;

public class PostgreSqlMediaSearchProviderTests
{
    private static MediaAsset MakeAsset(string name, MediaType type, string? title = null)
    {
        return MediaAsset.Create(
            FileName.Create(name),
            FileExtension.Create("png"),
            MimeType.Create("image/png"),
            FileSize.Create(1024),
            Checksum.Create("sha256:abcdef01"),
            StorageKey.Create($"img/{name}"),
            type,
            LanguageCode.Create("en"),
            title: title,
            dimensions: ImageDimensions.Create(10, 10),
            duration: type == MediaType.Video || type == MediaType.Audio ? Duration.FromSeconds(5) : null);
    }

    [Fact]
    public async Task Search_ByTerm_MatchesFileNameAndTitle()
    {
        using var db = InMemoryMediaContextFactory.Create();
        var provider = new PostgreSqlMediaSearchProvider(db);

        db.MediaAssets.Add(MakeAsset("sunset.png", MediaType.Image, title: "Beautiful Sunset"));
        db.MediaAssets.Add(MakeAsset("mountain.png", MediaType.Image, title: "Peak"));
        await db.SaveChangesAsync();

        var result = await provider.SearchAsync(new MediaSearchCriteria { Term = "sunset" });
        result.Items.Should().ContainSingle().Which.FileName.Value.Should().Be("sunset.png");
        result.TotalCount.Should().Be(1);
    }

    [Fact]
    public async Task Search_ByType_And_Paging()
    {
        using var db = InMemoryMediaContextFactory.Create();
        var provider = new PostgreSqlMediaSearchProvider(db);

        db.MediaAssets.Add(MakeAsset("a.png", MediaType.Image));
        db.MediaAssets.Add(MakeAsset("b.png", MediaType.Image));
        db.MediaAssets.Add(MakeAsset("c.png", MediaType.Document));
        await db.SaveChangesAsync();

        var all = await provider.SearchAsync(new MediaSearchCriteria());
        all.TotalCount.Should().Be(3);

        var result = await provider.SearchAsync(new MediaSearchCriteria { Types = new[] { "image" }, PageSize = 1 });
        result.Items.Should().HaveCount(1);
        result.TotalCount.Should().BeGreaterThan(0);
    }

    [Fact]
    public async Task Index_And_Remove_AreNoOps()
    {
        using var db = InMemoryMediaContextFactory.Create();
        var provider = new PostgreSqlMediaSearchProvider(db);
        var asset = MakeAsset("x.png", MediaType.Image);

        await provider.IndexAsync(asset);
        await provider.RemoveAsync(asset.Id);
    }
}

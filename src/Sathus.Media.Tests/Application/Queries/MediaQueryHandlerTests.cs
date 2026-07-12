using Moq;
using Sathus.Media.Application.Interfaces;
using Sathus.Media.Application.Queries.GetFolderTree;
using Sathus.Media.Application.Queries.GetMedia;
using Sathus.Media.Application.Queries.GetMediaById;
using Sathus.Media.Application.Queries.GetMediaUsage;
using Sathus.Media.Application.Queries.SearchMedia;
using Sathus.Media.Domain.Entities;
using Sathus.Media.Domain.Exceptions;

namespace Sathus.Media.Tests.Application.Queries;

public class MediaQueryHandlerTests
{
    [Fact]
    public async Task GetMedia_ReturnsPaged()
    {
        var repository = new Mock<IMediaRepository>();
        var assets = new List<MediaAsset>
        {
            MediaAsset.Create(FileName.Create("a.png"), FileExtension.Create("png"), MimeType.Create("image/png"),
                FileSize.Create(10), Checksum.Create("sha256:1"), StorageKey.Create("i/a.png"),
                MediaType.Image, LanguageCode.Create("en"), dimensions: ImageDimensions.Create(1, 1)),
            MediaAsset.Create(FileName.Create("b.png"), FileExtension.Create("png"), MimeType.Create("image/png"),
                FileSize.Create(10), Checksum.Create("sha256:2"), StorageKey.Create("i/b.png"),
                MediaType.Image, LanguageCode.Create("en"), dimensions: ImageDimensions.Create(1, 1))
        };

        repository.Setup(r => r.GetAsync(It.IsAny<MediaAssetFilterSpecification>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(assets);
        repository.Setup(r => r.CountAsync(It.IsAny<MediaAssetFilterSpecification>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(2);

        var result = await new GetMediaQueryHandler(repository.Object)
            .Handle(new GetMediaQuery(), CancellationToken.None);

        result.Items.Should().HaveCount(2);
        result.TotalCount.Should().Be(2);
        result.TotalPages.Should().Be(1);
    }

    [Fact]
    public async Task GetMediaById_NotFound_Throws()
    {
        var repository = new Mock<IMediaRepository>();
        repository.Setup(r => r.GetSingleAsync(It.IsAny<MediaAssetDetailSpecification>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((MediaAsset?)null);

        var act = async () => await new GetMediaByIdQueryHandler(repository.Object)
            .Handle(new GetMediaByIdQuery(Guid.NewGuid()), CancellationToken.None);

        await act.Should().ThrowAsync<MediaAssetNotFoundException>();
    }

    [Fact]
    public async Task GetMediaById_ReturnsDetailWithCounts()
    {
        var asset = MediaAsset.Create(FileName.Create("a.png"), FileExtension.Create("png"), MimeType.Create("image/png"),
            FileSize.Create(10), Checksum.Create("sha256:1"), StorageKey.Create("i/a.png"),
            MediaType.Image, LanguageCode.Create("en"), dimensions: ImageDimensions.Create(1, 1));
        asset.Usages.Add(new MediaUsage(asset.Id, UsageContext.Website, "page", "p1"));
        asset.Versions.Add(new MediaVersion(asset.Id, 1, FileName.Create("a.png"), FileExtension.Create("png"),
            MimeType.Create("image/png"), FileSize.Create(10), Checksum.Create("sha256:1"), StorageKey.Create("i/a.png")));

        var repository = new Mock<IMediaRepository>();
        repository.Setup(r => r.GetSingleAsync(It.IsAny<MediaAssetDetailSpecification>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(asset);

        var result = await new GetMediaByIdQueryHandler(repository.Object)
            .Handle(new GetMediaByIdQuery(asset.Id), CancellationToken.None);

        result.UsageCount.Should().Be(1);
        result.VersionCount.Should().Be(1);
    }

    [Fact]
    public async Task SearchMedia_DelegatesToProvider()
    {
        var provider = new Mock<IMediaSearchProvider>();
        var paged = new PagedResult<MediaAsset>(new List<MediaAsset>(), 1, 25, 0);
        provider.Setup(p => p.SearchAsync(It.IsAny<MediaSearchCriteria>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(paged);

        var result = await new SearchMediaQueryHandler(provider.Object)
            .Handle(new SearchMediaQuery { Term = "x" }, CancellationToken.None);

        result.TotalCount.Should().Be(0);
    }

    [Fact]
    public async Task GetMediaUsage_ReturnsMappedResponses()
    {
        var assetId = Guid.NewGuid();
        var usages = new List<MediaUsage> { new(assetId, UsageContext.Blog, "post", "1", "http://x", "T") };
        var repository = new Mock<IMediaUsageRepository>();
        repository.Setup(r => r.GetByAssetIdAsync(assetId, It.IsAny<CancellationToken>())).ReturnsAsync(usages);

        var result = await new GetMediaUsageQueryHandler(repository.Object)
            .Handle(new GetMediaUsageQuery(assetId), CancellationToken.None);

        result.Should().ContainSingle().Which.Context.Should().Be("blog");
    }

    [Fact]
    public async Task GetFolderTree_BuildsHierarchy()
    {
        var root = new MediaFolder("Root", "root");
        var child = new MediaFolder("Child", "child", parentFolderId: root.Id);
        var repository = new Mock<IMediaFolderRepository>();
        repository.Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<MediaFolder> { root, child });

        var result = await new GetFolderTreeQueryHandler(repository.Object)
            .Handle(new GetFolderTreeQuery(), CancellationToken.None);

        result.Roots.Should().ContainSingle().Which.Children.Should().ContainSingle().Which.Name.Should().Be("Child");
    }
}

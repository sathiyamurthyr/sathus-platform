namespace Sathus.Media.Tests.Domain;

public class ValueObjectTests
{
    [Fact]
    public void FileName_RejectsInvalidCharacters()
    {
        FileName.Create("valid.txt").Value.Should().Be("valid.txt");
        var act = () => FileName.Create("inv\\alid.txt");
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void FileExtension_NormalizesDot()
    {
        FileExtension.Create(".PNG").Value.Should().Be("png");
    }

    [Fact]
    public void MimeType_RejectsBadFormat()
    {
        MimeType.Create("image/png").Value.Should().Be("image/png");
        var act = () => MimeType.Create("not-a-mime");
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void FileSize_RejectsNonPositive()
    {
        FileSize.Create(10).Bytes.Should().Be(10);
        var act = () => FileSize.Create(0);
        act.Should().Throw<ArgumentOutOfRangeException>();
    }

    [Fact]
    public void Checksum_RequiresAlgorithmPrefix()
    {
        Checksum.Create("sha256:deadbeef").Value.Should().Be("sha256:deadbeef");
        var act = () => Checksum.Create("plaintext");
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void StorageKey_NormalizesLeadingSlash()
    {
        StorageKey.Create("/a/b/c").Value.Should().Be("a/b/c");
        StorageKey.Create("a/b/c").Bucket.Should().Be("a");
        StorageKey.Create("a/b/c").Key.Should().Be("b/c");
    }

    [Fact]
    public void AltText_ReturnsNullForEmpty()
    {
        AltText.Create("  ").Should().BeNull();
        AltText.Create("hi")!.Value.Should().Be("hi");
    }

    [Fact]
    public void MediaType_SupportsKnownAndFuture()
    {
        MediaType.Create("VIDEO").Value.Should().Be("video");
        MediaType.Image.IsKnown.Should().BeTrue();
        var future = MediaType.Create("hologram");
        future.Value.Should().Be("hologram");
        future.IsKnown.Should().BeFalse();
    }

    [Fact]
    public void ImageDimensions_RequiresPositive()
    {
        ImageDimensions.Create(10, 20).AspectRatio.Should().Be(0.5);
        var act = () => ImageDimensions.Create(0, 10);
        act.Should().Throw<ArgumentOutOfRangeException>();
    }

    [Fact]
    public void Duration_FromSecondsNullable()
    {
        Duration.FromSeconds(0).Should().BeNull();
        Duration.FromSeconds(5)!.Value.TotalSeconds.Should().Be(5);
    }

    [Fact]
    public void Hash_NullableAndValidated()
    {
        Hash.Create(null).Should().BeNull();
        Hash.Create("abcdef01")!.Value.Should().Be("abcdef01");
        var act = () => Hash.Create("not-hex!");
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void LanguageCode_ValidatesFormat()
    {
        LanguageCode.Create("en-US").Value.Should().Be("en-us");
        var act = () => LanguageCode.Create("english");
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void UsageContext_SupportsAllProductSurfaces()
    {
        UsageContext.Website.Value.Should().Be("website");
        UsageContext.AiKnowledgeBase.Value.Should().Be("ai-knowledge-base");
        UsageContext.FromName("products").Value.Should().Be("products");
    }
}

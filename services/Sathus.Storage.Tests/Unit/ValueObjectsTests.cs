using FluentAssertions;
using Xunit;

namespace Sathus.Storage.Tests.Unit;

public class ValueObjectsTests
{
    [Theory]
    [InlineData("my-bucket")]
    [InlineData("my-bucket-123")]
    public void BucketName_Create_ValidName_ShouldSucceed(string name)
    {
        var bucket = Domain.ValueObjects.BucketName.Create(name);
        bucket.Value.Should().Be(name.ToLowerInvariant());
    }

    [Theory]
    [InlineData("ab")]
    [InlineData("invalid-bucket-name-that-is-definitely-longer-than-the-sixty-three-character-maximum-allowed-length-1234567890")]
    [InlineData("-invalid")]
    [InlineData("invalid-")]
    public void BucketName_Create_InvalidName_ShouldThrow(string name)
    {
        FluentActions.Invoking(() => Domain.ValueObjects.BucketName.Create(name)).Should().Throw<ArgumentException>();
    }

    [Theory]
    [InlineData("folder/subfolder/file.pdf")]
    [InlineData("simple-key")]
    public void ObjectPath_Create_ValidPath_ShouldSucceed(string path)
    {
        var objPath = Domain.ValueObjects.ObjectPath.Create(path);
        objPath.Value.Should().Be(path);
    }

    [Theory]
    [InlineData("application/pdf")]
    [InlineData("image/jpeg")]
    [InlineData("text/plain; charset=utf-8")]
    public void ContentType_Create_ValidType_ShouldSucceed(string contentType)
    {
        var ct = Domain.ValueObjects.ContentType.Create(contentType);
        ct.Value.Should().Be(contentType.ToLowerInvariant());
    }

    [Fact]
    public void FileHash_Create_ValidHash_ShouldSucceed()
    {
        var hash = Domain.ValueObjects.FileHash.Create("sha256", "abc123");
        hash.Algorithm.Should().Be("sha256");
        hash.Value.Should().Be("abc123");
    }

    [Fact]
    public void FileHash_Create_UnsupportedAlgorithm_ShouldThrow()
    {
        FluentActions.Invoking(() => Domain.ValueObjects.FileHash.Create("md999", "abc")).Should().Throw<ArgumentException>();
    }

    [Fact]
    public void StorageSize_FromBytes_AndToHumanReadable_ShouldWork()
    {
        var size = Domain.ValueObjects.StorageSize.FromBytes(1536);
        size.ToHumanReadable().Should().Be("1.50 KB");
    }

    [Fact]
    public void ObjectVersion_Generate_ShouldBeUnique()
    {
        var v1 = Domain.ValueObjects.ObjectVersion.Generate();
        var v2 = Domain.ValueObjects.ObjectVersion.Generate();
        v1.Value.Should().NotBe(v2.Value);
    }
}

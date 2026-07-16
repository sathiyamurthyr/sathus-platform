using Xunit;

namespace Sathus.Upload.Tests.Domain.ValueObjects;

public class UploadIdTests
{
    [Fact]
    public void Create_ValidValue_ReturnsInstance()
    {
        var uploadId = UploadId.Create("upload-123");

        uploadId.Value.Should().Be("upload-123");
    }

    [Fact]
    public void Create_NullOrEmpty_ThrowsException()
    {
        Assert.Throws<ArgumentException>(() => UploadId.Create(null!));
        Assert.Throws<ArgumentException>(() => UploadId.Create(""));
        Assert.Throws<ArgumentException>(() => UploadId.Create("   "));
    }

    [Fact]
    public void Create_MaxLengthExceeded_ThrowsException()
    {
        var longValue = new string('a', 129);

        Assert.Throws<ArgumentException>(() => UploadId.Create(longValue));
    }

    [Fact]
    public void ToString_ReturnsValue()
    {
        var uploadId = UploadId.Create("test-id");

        uploadId.ToString().Should().Be("test-id");
    }

    [Fact]
    public void MaxLength_Is128()
    {
        UploadId.MaxLength.Should().Be(128);
    }
}

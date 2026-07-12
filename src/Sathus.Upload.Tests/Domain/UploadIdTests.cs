using FluentAssertions;
using Xunit;

namespace Sathus.Upload.Tests.Domain;

public class UploadIdTests
{
    [Fact]
    public void Create_ValidValue_ReturnsInstance()
    {
        var uploadId = UploadId.Create("upload-123");

        uploadId.Value.Should().Be("upload-123");
    }

    [Fact]
    public void Create_Null_ThrowsArgumentException()
    {
        var act = () => UploadId.Create(null!);

        act.Should().Throw<ArgumentException>()
            .WithParameterName("value");
    }

    [Fact]
    public void Create_Empty_ThrowsArgumentException()
    {
        var act = () => UploadId.Create(string.Empty);

        act.Should().Throw<ArgumentException>()
            .WithParameterName("value");
    }

    [Theory]
    [InlineData("   ")]
    [InlineData("\t")]
    [InlineData("\n")]
    public void Create_Whitespace_ThrowsArgumentException(string value)
    {
        var act = () => UploadId.Create(value);

        act.Should().Throw<ArgumentException>()
            .WithParameterName("value");
    }

    [Fact]
    public void Create_WhitespacePadded_TrimsValue()
    {
        var uploadId = UploadId.Create("  upload-123  ");

        uploadId.Value.Should().Be("upload-123");
    }

    [Fact]
    public void Create_ExactlyMaxLength_ReturnsInstance()
    {
        var value = new string('a', UploadId.MaxLength);

        var uploadId = UploadId.Create(value);

        uploadId.Value.Should().HaveLength(UploadId.MaxLength);
    }

    [Fact]
    public void Create_MaxLengthExceeded_ThrowsArgumentException()
    {
        var longValue = new string('a', UploadId.MaxLength + 1);

        var act = () => UploadId.Create(longValue);

        act.Should().Throw<ArgumentException>()
            .WithParameterName("value");
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

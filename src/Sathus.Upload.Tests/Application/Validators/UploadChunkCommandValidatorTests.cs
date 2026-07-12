using FluentAssertions;
using Xunit;

namespace Sathus.Upload.Tests.Application.Validators;

public class UploadChunkCommandValidatorTests
{
    private readonly Sathus.Upload.Application.Validators.UploadChunkCommandValidator _validator = new();

    [Fact]
    public async Task Validate_ValidCommand_ReturnsSuccess()
    {
        var stream = new MemoryStream(new byte[1024]);
        var command = new Sathus.Upload.Application.Commands.UploadChunk.UploadChunkCommand(
            Guid.NewGuid(), 0, stream, "sha256:abc");

        var result = await _validator.ValidateAsync(command);
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public async Task Validate_NegativeChunkIndex_ReturnsFailure()
    {
        var stream = new MemoryStream(new byte[1024]);
        var command = new Sathus.Upload.Application.Commands.UploadChunk.UploadChunkCommand(
            Guid.NewGuid(), -1, stream);

        var result = await _validator.ValidateAsync(command);
        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public async Task Validate_EmptyChecksum_ReturnsSuccess()
    {
        var stream = new MemoryStream(new byte[1024]);
        var command = new Sathus.Upload.Application.Commands.UploadChunk.UploadChunkCommand(
            Guid.NewGuid(), 0, stream, null);

        var result = await _validator.ValidateAsync(command);
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public async Task Validate_MalformedChecksum_ReturnsFailure()
    {
        var stream = new MemoryStream(new byte[1024]);
        var command = new Sathus.Upload.Application.Commands.UploadChunk.UploadChunkCommand(
            Guid.NewGuid(), 0, stream, "abc");

        var result = await _validator.ValidateAsync(command);
        result.IsValid.Should().BeFalse();
    }
}

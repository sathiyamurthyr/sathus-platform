using FluentAssertions;
using Sathus.Upload.Application.Commands.StartUpload;
using Sathus.Upload.Application.Validators;
using Xunit;

namespace Sathus.Upload.Tests.Application.Validators;

public class StartUploadCommandValidatorTests
{
    private readonly StartUploadCommandValidator _validator = new();

    [Fact]
    public async Task Validate_ValidCommand_ReturnsSuccess()
    {
        var command = new StartUploadCommand(
            FileName: "test.pdf",
            FileExtension: "pdf",
            MimeType: "application/pdf",
            Size: 1024,
            ChunkSize: 512);

        var result = await _validator.ValidateAsync(command);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public async Task Validate_EmptyFileName_ReturnsFailure()
    {
        var command = new StartUploadCommand(
            FileName: "",
            FileExtension: "pdf",
            MimeType: "application/pdf",
            Size: 1024);

        var result = await _validator.ValidateAsync(command);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(StartUploadCommand.FileName));
    }

    [Fact]
    public async Task Validate_SizeExceedsLimit_ReturnsFailure()
    {
        var command = new StartUploadCommand(
            FileName: "huge.bin",
            FileExtension: "bin",
            MimeType: "application/octet-stream",
            Size: FileSize.MaxBytes + 1);

        var result = await _validator.ValidateAsync(command);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(StartUploadCommand.Size));
    }

    [Fact]
    public async Task Validate_FolderUploadWithoutFolderPath_ReturnsFailure()
    {
        var command = new StartUploadCommand(
            FileName: "folder.zip",
            FileExtension: "zip",
            MimeType: "application/zip",
            Size: 1024,
            ChunkSize: 512,
            IsFolder: true,
            FolderPath: null);

        var result = await _validator.ValidateAsync(command);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(StartUploadCommand.IsFolder));
    }

    [Fact]
    public async Task Validate_ChecksumWithoutAlgorithm_ReturnsFailure()
    {
        var command = new StartUploadCommand(
            FileName: "test.pdf",
            FileExtension: "pdf",
            MimeType: "application/pdf",
            Size: 1024,
            ChunkSize: 512,
            Checksum: "abc123");

        var result = await _validator.ValidateAsync(command);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(StartUploadCommand.Checksum));
    }

    [Fact]
    public async Task Validate_ChecksumValidFormat_ReturnsSuccess()
    {
        var command = new StartUploadCommand(
            FileName: "test.pdf",
            FileExtension: "pdf",
            MimeType: "application/pdf",
            Size: 1024,
            ChunkSize: 512,
            Checksum: "sha256:abc123");

        var result = await _validator.ValidateAsync(command);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public async Task Validate_ChunkSizeGreaterThanSize_ReturnsFailure()
    {
        var command = new StartUploadCommand(
            FileName: "test.pdf",
            FileExtension: "pdf",
            MimeType: "application/pdf",
            Size: 1024,
            ChunkSize: 2048);

        var result = await _validator.ValidateAsync(command);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(StartUploadCommand.ChunkSize));
    }
}

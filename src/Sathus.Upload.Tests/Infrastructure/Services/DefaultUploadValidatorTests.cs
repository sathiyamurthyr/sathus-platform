using Microsoft.Extensions.Logging;
using Sathus.Media.Domain.ValueObjects;
using Sathus.Storage.Domain.Interfaces;
using Sathus.Storage.Domain.Results;
using Sathus.Upload.Domain.Entities;
using Sathus.Upload.Domain.Exceptions;
using Sathus.Upload.Infrastructure.Services;

namespace Sathus.Upload.Tests.Infrastructure.Services;

public class DefaultUploadValidatorTests
{
    private static DefaultUploadValidator CreateValidator(bool exists = false)
    {
        var provider = new Mock<IStorageProvider>();
        provider
            .Setup(p => p.ExistsAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(exists);

        var factory = new Mock<IStorageProviderFactory>();
        factory
            .Setup(f => f.Resolve(It.IsAny<string?>()))
            .Returns(provider.Object);

        return new DefaultUploadValidator(factory.Object, Mock.Of<ILogger<DefaultUploadValidator>>());
    }

    private static UploadSession CreateValidSession()
    {
        return new UploadSession(
            sessionId: "valid-session",
            fileName: FileName.Create("valid.mp4"),
            fileExtension: FileExtension.Create("mp4"),
            mimeType: MimeType.Create("video/mp4"),
            fileSize: FileSize.Create(1 * 1024 * 1024),
            chunkSize: 1024);
    }

    [Fact]
    public async Task ValidateAsync_ValidSession_Passes()
    {
        var validator = CreateValidator();
        var session = CreateValidSession();

        var act = async () => await validator.ValidateAsync(session);

        await act.Should().NotThrowAsync();
    }

    [Fact]
    public async Task ValidateAsync_InvalidFileName_ThrowsException()
    {
        var validator = CreateValidator();
        var session = new UploadSession(
            sessionId: "bad-name",
            fileName: FileName.Create("..evil.mp4"),
            fileExtension: FileExtension.Create("mp4"),
            mimeType: MimeType.Create("video/mp4"),
            fileSize: FileSize.Create(1024),
            chunkSize: 512);

        var act = async () => await validator.ValidateAsync(session);

        await act.Should().ThrowAsync<ArgumentException>();
    }

    [Fact]
    public async Task ValidateAsync_InvalidExtension_ThrowsException()
    {
        var validator = CreateValidator();
        var session = new UploadSession(
            sessionId: "bad-ext",
            fileName: FileName.Create("malware.exe"),
            fileExtension: FileExtension.Create("exe"),
            mimeType: MimeType.Create("application/x-msdownload"),
            fileSize: FileSize.Create(1024),
            chunkSize: 512);

        var act = async () => await validator.ValidateAsync(session);

        await act.Should().ThrowAsync<ArgumentException>();
    }

    [Fact]
    public async Task ValidateAsync_InvalidMimeType_ThrowsException()
    {
        var validator = CreateValidator();
        var session = new UploadSession(
            sessionId: "bad-mime",
            fileName: FileName.Create("image.png"),
            fileExtension: FileExtension.Create("png"),
            mimeType: MimeType.Create("video/mp4"),
            fileSize: FileSize.Create(1024),
            chunkSize: 512);

        var act = async () => await validator.ValidateAsync(session);

        await act.Should().ThrowAsync<ArgumentException>();
    }

    [Fact]
    public async Task ValidateAsync_FileTooLarge_ThrowsException()
    {
        var validator = CreateValidator();
        var fileSize = FileSize.Create(1024);
        fileSize.Bytes = 11L * 1024 * 1024 * 1024;
        var session = new UploadSession(
            sessionId: "too-large",
            fileName: FileName.Create("big.pdf"),
            fileExtension: FileExtension.Create("pdf"),
            mimeType: MimeType.Create("application/pdf"),
            fileSize: fileSize,
            chunkSize: 512);

        var act = async () => await validator.ValidateAsync(session);

        await act.Should().ThrowAsync<ArgumentException>();
    }

    [Fact]
    public async Task ValidateAsync_ValidFolder_Succeeds()
    {
        var validator = CreateValidator();
        var session = new UploadSession(
            sessionId: "valid-folder",
            fileName: FileName.Create("video.mp4"),
            fileExtension: FileExtension.Create("mp4"),
            mimeType: MimeType.Create("video/mp4"),
            fileSize: FileSize.Create(1024),
            chunkSize: 512,
            isFolder: true,
            folderPath: "uploads/folder1/sub");

        var act = async () => await validator.ValidateAsync(session);

        await act.Should().NotThrowAsync();
    }

    [Fact]
    public async Task ValidateAsync_FolderWithPathTraversal_ThrowsException()
    {
        var validator = CreateValidator();
        var session = new UploadSession(
            sessionId: "traversal-folder",
            fileName: FileName.Create("video.mp4"),
            fileExtension: FileExtension.Create("mp4"),
            mimeType: MimeType.Create("video/mp4"),
            fileSize: FileSize.Create(1024),
            chunkSize: 512,
            isFolder: true,
            folderPath: "uploads/../etc/passwd");

        var act = async () => await validator.ValidateAsync(session);

        await act.Should().ThrowAsync<ArgumentException>();
    }
}

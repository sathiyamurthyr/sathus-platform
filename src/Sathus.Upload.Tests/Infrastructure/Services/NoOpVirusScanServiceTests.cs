using Microsoft.Extensions.Logging;
using Sathus.Media.Domain.ValueObjects;
using Sathus.Upload.Domain.Entities;
using Sathus.Upload.Infrastructure.Services;

namespace Sathus.Upload.Tests.Infrastructure.Services;

public class NoOpVirusScanServiceTests
{
    private static UploadSession CreateSession()
    {
        return new UploadSession(
            sessionId: "scan-session",
            fileName: FileName.Create("document.pdf"),
            fileExtension: FileExtension.Create("pdf"),
            mimeType: MimeType.Create("application/pdf"),
            fileSize: FileSize.Create(1024),
            chunkSize: 512);
    }

    [Fact]
    public async Task ScanAsync_AlwaysReturnsTrue()
    {
        var service = new NoOpVirusScanService(Mock.Of<ILogger<NoOpVirusScanService>>());
        var session = CreateSession();
        using var stream = new MemoryStream(new byte[] { 1, 2, 3, 4 });

        var result = await service.ScanAsync(session, stream);

        result.Should().BeTrue();
    }

    [Fact]
    public async Task ScanAsync_AnySession_Succeeds()
    {
        var service = new NoOpVirusScanService(Mock.Of<ILogger<NoOpVirusScanService>>());
        var session = CreateSession();
        using var stream = new MemoryStream(Array.Empty<byte>());

        var act = async () => await service.ScanAsync(session, stream);

        await act.Should().NotThrowAsync();
        (await service.ScanAsync(session, stream)).Should().BeTrue();
    }
}

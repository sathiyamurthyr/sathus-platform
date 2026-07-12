using Microsoft.Extensions.Logging;
using Sathus.Media.Domain.ValueObjects;
using Sathus.Upload.Domain.Entities;
using Sathus.Upload.Infrastructure.Services;

namespace Sathus.Upload.Tests.Infrastructure.Services;

public class NoOpMetadataExtractionServiceTests
{
    private static UploadSession CreateSession()
    {
        return new UploadSession(
            sessionId: "meta-session",
            fileName: FileName.Create("document.pdf"),
            fileExtension: FileExtension.Create("pdf"),
            mimeType: MimeType.Create("application/pdf"),
            fileSize: FileSize.Create(1024),
            chunkSize: 512);
    }

    [Fact]
    public async Task ExtractAsync_ReturnsEmptyDictionary()
    {
        var service = new NoOpMetadataExtractionService(Mock.Of<ILogger<NoOpMetadataExtractionService>>());
        var session = CreateSession();
        using var stream = new MemoryStream(new byte[] { 1, 2, 3, 4 });

        var result = await service.ExtractAsync(session, stream);

        result.Should().NotBeNull();
        result.Should().BeEmpty();
    }

    [Fact]
    public async Task ExtractAsync_AlwaysSucceeds()
    {
        var service = new NoOpMetadataExtractionService(Mock.Of<ILogger<NoOpMetadataExtractionService>>());
        var session = CreateSession();
        using var stream = new MemoryStream(Array.Empty<byte>());

        var act = async () => await service.ExtractAsync(session, stream);

        await act.Should().NotThrowAsync();
        (await service.ExtractAsync(session, stream)).Should().BeEmpty();
    }
}

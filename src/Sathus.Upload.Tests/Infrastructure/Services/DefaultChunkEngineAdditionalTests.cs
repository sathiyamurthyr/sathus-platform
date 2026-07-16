namespace Sathus.Upload.Tests.Infrastructure.Services;

public class DefaultChunkEngineAdditionalTests
{
    private readonly DefaultChunkEngine _engine = new(Mock.Of<Microsoft.Extensions.Logging.ILogger<DefaultChunkEngine>>());

    [Fact]
    public void CalculateChunkSize_VeryLargeFile_Returns50MB()
    {
        var fileSize = 11L * 1024 * 1024 * 1024;

        var chunkSize = _engine.CalculateChunkSize(fileSize);

        chunkSize.Should().Be(50L * 1024 * 1024);
    }

    [Fact]
    public void CalculateChunkSize_ZeroFile_Returns5MB()
    {
        var chunkSize = _engine.CalculateChunkSize(0);

        chunkSize.Should().Be(5L * 1024 * 1024);
    }
}

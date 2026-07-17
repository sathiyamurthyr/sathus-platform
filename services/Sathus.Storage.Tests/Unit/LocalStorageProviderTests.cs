using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;

namespace Sathus.Storage.Tests.Unit;

public class LocalStorageProviderTests
{
    [Fact]
    public async Task UploadAsync_ValidStream_ShouldSucceed()
    {
        var tempPath = Path.Combine(Path.GetTempPath(), $"storage-test-{Guid.NewGuid()}");
        var options = Options.Create(new Infrastructure.Configuration.LocalStorageOptions { RootPath = tempPath, CreateDirectories = true });
        var loggerMock = new Mock<ILogger<Infrastructure.Providers.LocalStorageProvider>>();
        var validator = new Infrastructure.Security.StoragePathValidator(Mock.Of<ILogger<Infrastructure.Security.StoragePathValidator>>());
        var provider = new Infrastructure.Providers.LocalStorageProvider(options, loggerMock.Object, validator);

        var data = new MemoryStream(System.Text.Encoding.UTF8.GetBytes("hello world"));
        var result = await provider.UploadAsync("test.txt", data, "text/plain", null, CancellationToken.None);

        result.Succeeded.Should().BeTrue();
        File.Exists(Path.Combine(tempPath, "test.txt")).Should().BeTrue();
    }

    [Fact]
    public async Task ExistsAsync_ExistingFile_ShouldReturnTrue()
    {
        var tempPath = Path.Combine(Path.GetTempPath(), $"storage-test-{Guid.NewGuid()}");
        var options = Options.Create(new Infrastructure.Configuration.LocalStorageOptions { RootPath = tempPath, CreateDirectories = true });
        var loggerMock = new Mock<ILogger<Infrastructure.Providers.LocalStorageProvider>>();
        var validator = new Infrastructure.Security.StoragePathValidator(Mock.Of<ILogger<Infrastructure.Security.StoragePathValidator>>());
        var provider = new Infrastructure.Providers.LocalStorageProvider(options, loggerMock.Object, validator);

        var data = new MemoryStream(System.Text.Encoding.UTF8.GetBytes("hello"));
        await provider.UploadAsync("exists.txt", data, "text/plain", null, CancellationToken.None);
        var exists = await provider.ExistsAsync("exists.txt", CancellationToken.None);

        exists.Should().BeTrue();
    }

    [Fact]
    public async Task DeleteAsync_ExistingFile_ShouldSucceed()
    {
        var tempPath = Path.Combine(Path.GetTempPath(), $"storage-test-{Guid.NewGuid()}");
        var options = Options.Create(new Infrastructure.Configuration.LocalStorageOptions { RootPath = tempPath, CreateDirectories = true });
        var loggerMock = new Mock<ILogger<Infrastructure.Providers.LocalStorageProvider>>();
        var validator = new Infrastructure.Security.StoragePathValidator(Mock.Of<ILogger<Infrastructure.Security.StoragePathValidator>>());
        var provider = new Infrastructure.Providers.LocalStorageProvider(options, loggerMock.Object, validator);

        var data = new MemoryStream(System.Text.Encoding.UTF8.GetBytes("temp"));
        await provider.UploadAsync("todelete.txt", data, "text/plain", null, CancellationToken.None);
        var result = await provider.DeleteAsync("todelete.txt", CancellationToken.None);

        result.Succeeded.Should().BeTrue();
        File.Exists(Path.Combine(tempPath, "todelete.txt")).Should().BeFalse();
    }
}

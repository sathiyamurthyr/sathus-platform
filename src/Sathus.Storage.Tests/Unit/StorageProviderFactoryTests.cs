using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using Sathus.Storage.Domain.Enums;
using Sathus.Storage.Domain.Interfaces;
using Sathus.Storage.Domain.Results;
using Sathus.Storage.Infrastructure.Configuration;
using Sathus.Storage.Infrastructure.Factory;
using Sathus.Storage.Infrastructure.Providers;
using Sathus.Storage.Infrastructure.Security;
using Xunit;

namespace Sathus.Storage.Tests.Unit;

public class StorageProviderFactoryTests
{
    [Fact]
    public void Resolve_DefaultProvider_ShouldReturnRegisteredProvider()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        var sp = services.BuildServiceProvider();

        var registry = new StorageProviderRegistry(Mock.Of<ILogger<StorageProviderRegistry>>());
        var providerMock = new Mock<IStorageProvider>();
        providerMock.Setup(p => p.ProviderName).Returns("local");
        providerMock.Setup(p => p.ProviderType).Returns(StorageProviderType.Local);
        registry.RegisterProvider(providerMock.Object);
        registry.SetDefaultProvider("local");

        var logger = sp.GetRequiredService<ILogger<StorageProviderFactory>>();
        var factory = new StorageProviderFactory(registry, logger);

        var resolved = factory.Resolve();
        resolved.ProviderName.Should().Be("local");
    }

    [Fact]
    public void Resolve_NamedProvider_ShouldReturnCorrectProvider()
    {
        var registry = new StorageProviderRegistry(Mock.Of<ILogger<StorageProviderRegistry>>());
        var providerMock = new Mock<IStorageProvider>();
        providerMock.Setup(p => p.ProviderName).Returns("minio");
        providerMock.Setup(p => p.ProviderType).Returns(StorageProviderType.MinIO);
        registry.RegisterProvider(providerMock.Object);
        registry.SetDefaultProvider("minio");

        var logger = Mock.Of<ILogger<StorageProviderFactory>>();
        var factory = new StorageProviderFactory(registry, logger);

        var resolved = factory.Resolve("minio");
        resolved.ProviderName.Should().Be("minio");
    }

    [Fact]
    public void Resolve_NotFound_ShouldThrow()
    {
        var registry = new StorageProviderRegistry(Mock.Of<ILogger<StorageProviderRegistry>>());
        var logger = Mock.Of<ILogger<StorageProviderFactory>>();
        var factory = new StorageProviderFactory(registry, logger);

        FluentActions.Invoking(() => factory.Resolve("unknown")).Should().Throw<Domain.Exceptions.InvalidStorageConfigurationException>();
    }
}

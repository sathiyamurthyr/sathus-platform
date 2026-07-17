using System;
using System.Linq;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;
using Sathus.Storage.Domain.Enums;
using Sathus.Storage.Domain.Interfaces;
using Sathus.Storage.Infrastructure.Factory;
using Sathus.Storage.Infrastructure.Providers;
using Xunit;

namespace Sathus.Storage.Tests.Unit;

public class StorageProviderRegistryTests
{
    [Fact]
    public void RegisterProvider_UniqueNames_ShouldSucceed()
    {
        var registry = new StorageProviderRegistry(Mock.Of<ILogger<StorageProviderRegistry>>());
        var providerMock = new Mock<IStorageProvider>();
        providerMock.Setup(p => p.ProviderName).Returns("test");
        providerMock.Setup(p => p.ProviderType).Returns(StorageProviderType.Local);

        registry.RegisterProvider(providerMock.Object);
        registry.GetAllProviders().Should().ContainSingle().Which.ProviderName.Should().Be("test");
    }

    [Fact]
    public void RegisterProvider_DuplicateName_ShouldThrow()
    {
        var registry = new StorageProviderRegistry(Mock.Of<ILogger<StorageProviderRegistry>>());
        var providerMock1 = new Mock<IStorageProvider>();
        providerMock1.Setup(p => p.ProviderName).Returns("test");
        providerMock1.Setup(p => p.ProviderType).Returns(StorageProviderType.Local);

        var providerMock2 = new Mock<IStorageProvider>();
        providerMock2.Setup(p => p.ProviderName).Returns("test");
        providerMock2.Setup(p => p.ProviderType).Returns(StorageProviderType.Local);

        registry.RegisterProvider(providerMock1.Object);
        FluentActions.Invoking(() => registry.RegisterProvider(providerMock2.Object)).Should().Throw<Domain.Exceptions.InvalidStorageConfigurationException>();
    }

    [Fact]
    public void SetDefaultProvider_NotFound_ShouldThrow()
    {
        var registry = new StorageProviderRegistry(Mock.Of<ILogger<StorageProviderRegistry>>());
        FluentActions.Invoking(() => registry.SetDefaultProvider("nonexistent")).Should().Throw<Domain.Exceptions.InvalidStorageConfigurationException>();
    }
}

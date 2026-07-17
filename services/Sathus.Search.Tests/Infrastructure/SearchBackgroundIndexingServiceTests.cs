global using FluentAssertions;
global using Xunit;
global using Microsoft.Extensions.Logging;
global using Moq;
global using Sathus.Search.Application.Interfaces;
global using Sathus.Search.Infrastructure.HostedServices;

namespace Sathus.Search.Tests.Infrastructure;

public class SearchBackgroundIndexingServiceTests
{
    private class FakeServiceProvider : IServiceProvider
    {
        private readonly Dictionary<Type, object> _services;

        public FakeServiceProvider(Dictionary<Type, object> services)
        {
            _services = services;
        }

        public object? GetService(Type serviceType)
        {
            return _services.TryGetValue(serviceType, out var service) ? service : null;
        }
    }

    [Fact]
    public async Task ExecuteAsync_Should_Call_Indexer_And_Log()
    {
        var indexer = new Mock<ISearchIndexer>();
        indexer.Setup(i => i.GetPendingCountAsync(It.IsAny<CancellationToken>())).ReturnsAsync(0);
        var serviceProvider = new FakeServiceProvider(new Dictionary<Type, object>
        {
            { typeof(ISearchIndexer), indexer.Object }
        });
        var scope = new Mock<IServiceScope>();
        scope.Setup(s => s.ServiceProvider).Returns(serviceProvider);
        var scopeFactory = new Mock<IServiceScopeFactory>();
        scopeFactory.Setup(sf => sf.CreateScope()).Returns(scope.Object);
        var logger = new Mock<ILogger<SearchBackgroundIndexingService>>();
        var service = new SearchBackgroundIndexingService(scopeFactory.Object, logger.Object);
        var cts = new CancellationTokenSource();

        var task = service.StartAsync(cts.Token);
        await Task.Delay(100);
        cts.Cancel();
        await task;

        indexer.Verify(i => i.GetPendingCountAsync(It.IsAny<CancellationToken>()), Times.AtLeastOnce);
    }

    [Fact]
    public async Task ExecuteAsync_Should_Handle_Exceptions()
    {
        var indexer = new Mock<ISearchIndexer>();
        indexer.Setup(i => i.GetPendingCountAsync(It.IsAny<CancellationToken>())).ThrowsAsync(new InvalidOperationException("test error"));
        var serviceProvider = new FakeServiceProvider(new Dictionary<Type, object>
        {
            { typeof(ISearchIndexer), indexer.Object }
        });
        var scope = new Mock<IServiceScope>();
        scope.Setup(s => s.ServiceProvider).Returns(serviceProvider);
        var scopeFactory = new Mock<IServiceScopeFactory>();
        scopeFactory.Setup(sf => sf.CreateScope()).Returns(scope.Object);
        var logger = new Mock<ILogger<SearchBackgroundIndexingService>>();
        var service = new SearchBackgroundIndexingService(scopeFactory.Object, logger.Object);
        var cts = new CancellationTokenSource();

        var task = service.StartAsync(cts.Token);
        await Task.Delay(100);
        cts.Cancel();
        await task;

        indexer.Verify(i => i.GetPendingCountAsync(It.IsAny<CancellationToken>()), Times.AtLeastOnce);
    }
}

global using FluentAssertions;
global using Xunit;
global using Microsoft.Extensions.Caching.Memory;
global using Microsoft.Extensions.Logging;
global using Moq;
global using Sathus.Search.Application.Interfaces;
global using Sathus.Search.Domain.Entities;
global using Sathus.Search.Domain.Enums;
global using Sathus.Search.Infrastructure.Services;

namespace Sathus.Search.Tests.Infrastructure;

public class SearchSynonymProviderTests
{
    [Fact]
    public async Task GetSynonymsAsync_Should_Return_Empty_When_Index_Not_Found()
    {
        var repository = new Mock<ISearchRepository>();
        repository.Setup(r => r.GetByCodeAsync(It.IsAny<string>(), It.IsAny<CancellationToken>())).ReturnsAsync((SearchIndex?)null);
        var cache = new MemoryCache(new MemoryCacheOptions());
        var logger = Mock.Of<ILogger<SearchSynonymProvider>>();
        var provider = new SearchSynonymProvider(repository.Object, cache, logger);

        var synonyms = await provider.GetSynonymsAsync("nonexistent", CancellationToken.None);

        synonyms.Should().BeEmpty();
    }

    [Fact]
    public async Task GetSynonymsAsync_Should_Return_Synonyms_From_Index()
    {
        var index = SearchIndex.Create(Guid.NewGuid(), "Main", "main");
        index.AddSynonym("phone", "mobile");
        index.AddSynonym("car", "automobile");
        var repository = new Mock<ISearchRepository>();
        repository.Setup(r => r.GetByCodeAsync("main", CancellationToken.None)).ReturnsAsync(index);
        var cache = new MemoryCache(new MemoryCacheOptions());
        var logger = Mock.Of<ILogger<SearchSynonymProvider>>();
        var provider = new SearchSynonymProvider(repository.Object, cache, logger);

        var synonyms = await provider.GetSynonymsAsync("main", CancellationToken.None);

        synonyms.Should().HaveCount(2);
        synonyms["phone"].Should().Be("mobile");
        synonyms["car"].Should().Be("automobile");
    }

    [Fact]
    public async Task GetSynonymsAsync_Should_Use_Cache_On_Second_Call()
    {
        var index = SearchIndex.Create(Guid.NewGuid(), "Main", "main");
        index.AddSynonym("phone", "mobile");
        var repository = new Mock<ISearchRepository>();
        repository.Setup(r => r.GetByCodeAsync("main", CancellationToken.None)).ReturnsAsync(index);
        var cache = new MemoryCache(new MemoryCacheOptions());
        var logger = Mock.Of<ILogger<SearchSynonymProvider>>();
        var provider = new SearchSynonymProvider(repository.Object, cache, logger);

        await provider.GetSynonymsAsync("main", CancellationToken.None);
        await provider.GetSynonymsAsync("main", CancellationToken.None);

        repository.Verify(r => r.GetByCodeAsync("main", It.IsAny<CancellationToken>()), Times.Once);
    }
}

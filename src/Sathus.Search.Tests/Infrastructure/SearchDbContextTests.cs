global using FluentAssertions;
global using Microsoft.EntityFrameworkCore;
global using Xunit;
global using Sathus.Search.Infrastructure.Persistence;

namespace Sathus.Search.Tests.Infrastructure;

public class SearchDbContextTests
{
    [Fact]
    public void Can_Build_Model_Without_Errors()
    {
        var options = new DbContextOptionsBuilder<SearchDbContext>()
            .UseInMemoryDatabase("test-db")
            .Options;

        using var context = new SearchDbContext(options);
        var model = context.Model;

        model.Should().NotBeNull();
        model.FindEntityType(typeof(SearchIndex))!.Should().NotBeNull();
        model.FindEntityType(typeof(SearchDocument))!.Should().NotBeNull();
        model.FindEntityType(typeof(SearchField))!.Should().NotBeNull();
        model.FindEntityType(typeof(SearchFacet))!.Should().NotBeNull();
        model.FindEntityType(typeof(SearchSynonym))!.Should().NotBeNull();
        model.FindEntityType(typeof(SearchRanking))!.Should().NotBeNull();
        model.FindEntityType(typeof(SearchSuggestion))!.Should().NotBeNull();
        model.FindEntityType(typeof(SearchHighlight))!.Should().NotBeNull();
    }

    [Fact]
    public async Task SaveChangesAsync_Should_Set_CreatedAt_On_Add()
    {
        var options = new DbContextOptionsBuilder<SearchDbContext>()
            .UseInMemoryDatabase("test-db-audit")
            .Options;

        using var context = new SearchDbContext(options);

        var index = SearchIndex.Create(Guid.NewGuid(), "Main", "main");
        await context.SearchIndexes.AddAsync(index);
        await context.SaveChangesAsync();

        index.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
        index.UpdatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public async Task SaveChangesAsync_Should_Set_UpdatedAt_On_Modify()
    {
        var options = new DbContextOptionsBuilder<SearchDbContext>()
            .UseInMemoryDatabase("test-db-update")
            .Options;

        using var context = new SearchDbContext(options);

        var index = SearchIndex.Create(Guid.NewGuid(), "Main", "main");
        await context.SearchIndexes.AddAsync(index);
        await context.SaveChangesAsync();

        index.Update("Updated", "main");
        context.SearchIndexes.Update(index);
        await context.SaveChangesAsync();

        index.UpdatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }
}

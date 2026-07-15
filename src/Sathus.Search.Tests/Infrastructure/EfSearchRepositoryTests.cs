global using FluentAssertions;
global using Microsoft.EntityFrameworkCore;
global using Moq;
global using Xunit;
global using MediatR;
global using Sathus.Search.Application.Interfaces;
global using Sathus.Search.Domain.Entities;
global using Sathus.Search.Domain.Enums;
global using Sathus.Search.Infrastructure.Persistence;
global using Sathus.Search.Infrastructure.Repositories;

namespace Sathus.Search.Tests.Infrastructure;

public class EfSearchRepositoryTests
{
    private SearchDbContext CreateContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<SearchDbContext>()
            .UseInMemoryDatabase(dbName)
            .Options;
        return new SearchDbContext(options);
    }

    private EfSearchRepository CreateRepository(SearchDbContext context)
    {
        var mediator = Mock.Of<IMediator>();
        return new EfSearchRepository(context, mediator);
    }

    [Fact]
    public async Task AddAsync_Should_Persist_Document()
    {
        await using var context = CreateContext("repo-add");
        var repository = CreateRepository(context);
        var document = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", url: null);

        await repository.AddAsync(document);
        await repository.SaveChangesAsync();

        var saved = await repository.GetByIdAsync(document.Id);
        saved.Should().NotBeNull();
        saved!.Title.Should().Be("Title");
    }

    [Fact]
    public async Task GetByExternalIdAsync_Should_Return_Document()
    {
        await using var context = CreateContext("repo-external");
        var repository = CreateRepository(context);
        var indexId = Guid.NewGuid();
        var document = SearchDocument.Create(indexId, "ext-1", IndexSourceType.Page, "Title", "Content", url: null);
        context.SearchDocuments.Add(document);
        await context.SaveChangesAsync();

        var result = await repository.GetByExternalIdAsync(indexId, "ext-1");

        result.Should().NotBeNull();
        result!.ExternalId.Should().Be("ext-1");
    }

    [Fact]
    public async Task GetByCodeAsync_Should_Return_Index()
    {
        await using var context = CreateContext("repo-code");
        var repository = CreateRepository(context);
        var index = SearchIndex.Create(Guid.NewGuid(), "Main", "main");
        context.SearchIndexes.Add(index);
        await context.SaveChangesAsync();

        var result = await repository.GetByCodeAsync("main");

        result.Should().NotBeNull();
        result!.Name.Should().Be("Main");
    }

    [Fact]
    public async Task GetAllAsync_Should_Return_All_Indexes()
    {
        await using var context = CreateContext("repo-getall");
        var repository = CreateRepository(context);
        context.SearchIndexes.Add(SearchIndex.Create(Guid.NewGuid(), "Index 1", "IDX1"));
        context.SearchIndexes.Add(SearchIndex.Create(Guid.NewGuid(), "Index 2", "IDX2"));
        await context.SaveChangesAsync();

        var result = await repository.GetAllAsync();

        result.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetEnabledAsync_Should_Filter_Enabled_Indexes()
    {
        await using var context = CreateContext("repo-enabled");
        var repository = CreateRepository(context);
        var enabled = SearchIndex.Create(Guid.NewGuid(), "Enabled", "EN");
        var disabled = SearchIndex.Create(Guid.NewGuid(), "Disabled", "DIS");
        disabled.Disable();
        context.SearchIndexes.Add(enabled);
        context.SearchIndexes.Add(disabled);
        await context.SaveChangesAsync();

        var result = await repository.GetEnabledAsync();

        result.Should().ContainSingle();
        result[0].Code.Should().Be("EN");
    }

    [Fact]
    public async Task DeleteAsync_Should_Soft_Delete_Document()
    {
        await using var context = CreateContext("repo-delete");
        var repository = CreateRepository(context);
        var document = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", url: null);
        context.SearchDocuments.Add(document);
        await context.SaveChangesAsync();

        await repository.DeleteAsync(document);
        await repository.SaveChangesAsync();

        var result = await repository.GetByIdAsync(document.Id);
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetIndexWithDocumentsAsync_Should_Include_Navigation()
    {
        await using var context = CreateContext("repo-include");
        var repository = CreateRepository(context);
        var index = SearchIndex.Create(Guid.NewGuid(), "Main", "main");
        index.AddField("title", "text");
        index.AddSynonym("phone", "mobile");
        context.SearchIndexes.Add(index);
        await context.SaveChangesAsync();

        var result = await repository.GetIndexWithDocumentsAsync(index.Id);

        result.Should().NotBeNull();
        result!.Fields.Should().ContainSingle();
        result.Synonyms.Should().ContainSingle();
    }

    [Fact]
    public async Task GetByIndexAsync_Should_Return_Documents_For_Index()
    {
        await using var context = CreateContext("repo-byindex");
        var repository = CreateRepository(context);
        var indexId = Guid.NewGuid();
        context.SearchDocuments.Add(SearchDocument.Create(indexId, "ext-1", IndexSourceType.Page, "T", "C", url: null));
        context.SearchDocuments.Add(SearchDocument.Create(Guid.NewGuid(), "ext-2", IndexSourceType.Page, "T", "C", url: null));
        await context.SaveChangesAsync();

        var result = await repository.GetByIndexAsync(indexId);

        result.Should().HaveCount(1);
        result[0].IndexId.Should().Be(indexId);
    }

    [Fact]
    public async Task GetBySourceTypeAsync_Should_Return_Documents_By_SourceType()
    {
        await using var context = CreateContext("repo-bysource");
        var repository = CreateRepository(context);
        context.SearchDocuments.Add(SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "T", "C", url: null));
        context.SearchDocuments.Add(SearchDocument.Create(Guid.NewGuid(), "ext-2", IndexSourceType.Product, "T2", "C2", url: null));
        await context.SaveChangesAsync();

        var result = await repository.GetBySourceTypeAsync(IndexSourceType.Page);

        result.Should().HaveCount(1);
        result[0].SourceType.Should().Be(IndexSourceType.Page);
    }
}

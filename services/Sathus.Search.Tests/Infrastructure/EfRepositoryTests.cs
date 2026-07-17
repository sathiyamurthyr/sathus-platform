global using FluentAssertions;
global using Microsoft.EntityFrameworkCore;
global using Moq;
global using Xunit;
global using MediatR;
global using Sathus.Search.Application.Interfaces;
global using Sathus.Search.Application.Specifications;
global using Sathus.Search.Domain.Entities;
global using Sathus.Search.Domain.Enums;
global using Sathus.Search.Infrastructure.Persistence;
global using Sathus.Search.Infrastructure.Repositories;
global using Sathus.SharedKernel.Specifications;

namespace Sathus.Search.Tests.Infrastructure;

public class EfRepositoryTests
{
    private SearchDbContext CreateContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<SearchDbContext>()
            .UseInMemoryDatabase(dbName)
            .Options;
        return new SearchDbContext(options);
    }

    [Fact]
    public async Task GetByIdAsync_Should_Return_Entity()
    {
        await using var context = CreateContext("repo-getbyid");
        var mediator = Mock.Of<IMediator>();
        var repository = new EfRepository<SearchDocument>(context, mediator);
        var document = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", url: null);
        context.SearchDocuments.Add(document);
        await context.SaveChangesAsync();

        var result = await repository.GetByIdAsync(document.Id);

        result.Should().NotBeNull();
        result!.Title.Should().Be("Title");
    }

    [Fact]
    public async Task GetAllAsync_Should_Return_All()
    {
        await using var context = CreateContext("repo-getall");
        var mediator = Mock.Of<IMediator>();
        var repository = new EfRepository<SearchDocument>(context, mediator);
        context.SearchDocuments.Add(SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "T", "C", url: null));
        context.SearchDocuments.Add(SearchDocument.Create(Guid.NewGuid(), "ext-2", IndexSourceType.Page, "T2", "C2", url: null));
        await context.SaveChangesAsync();

        var result = await repository.GetAllAsync();

        result.Should().HaveCount(2);
    }

    [Fact]
    public async Task AddAsync_Should_Add_Entity()
    {
        await using var context = CreateContext("repo-add");
        var mediator = Mock.Of<IMediator>();
        var repository = new EfRepository<SearchDocument>(context, mediator);
        var document = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", url: null);

        await repository.AddAsync(document);
        await repository.SaveChangesAsync();

        var saved = await repository.GetByIdAsync(document.Id);
        saved.Should().NotBeNull();
    }

    [Fact]
    public async Task UpdateAsync_Should_Update_Entity()
    {
        await using var context = CreateContext("repo-update");
        var mediator = Mock.Of<IMediator>();
        var repository = new EfRepository<SearchDocument>(context, mediator);
        var document = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", url: null);
        context.SearchDocuments.Add(document);
        await context.SaveChangesAsync();

        document.Update("New Title", "New content", "http://url", "http://img", Guid.NewGuid());
        await repository.UpdateAsync(document);
        await repository.SaveChangesAsync();

        var updated = await repository.GetByIdAsync(document.Id);
        updated!.Title.Should().Be("New Title");
    }

    [Fact]
    public async Task DeleteAsync_Should_Mark_Deleted()
    {
        await using var context = CreateContext("repo-delete");
        var mediator = Mock.Of<IMediator>();
        var repository = new EfRepository<SearchDocument>(context, mediator);
        var document = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", url: null);
        context.SearchDocuments.Add(document);
        await context.SaveChangesAsync();

        await repository.DeleteAsync(document);
        await repository.SaveChangesAsync();

        document.IsDeleted.Should().BeTrue();
    }

    [Fact]
    public async Task SaveChangesAsync_Should_Dispatch_Domain_Events()
    {
        await using var context = CreateContext("repo-events");
        var mediator = new Mock<IMediator>();
        var repository = new EfRepository<SearchDocument>(context, mediator.Object);
        var document = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", url: null);
        document.Delete(Guid.NewGuid());
        context.SearchDocuments.Add(document);

        await repository.SaveChangesAsync();

        mediator.Verify(m => m.Publish(It.IsAny<INotification>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ExistsAsync_Should_Return_True_When_Exists()
    {
        await using var context = CreateContext("repo-exists");
        var mediator = Mock.Of<IMediator>();
        var repository = new EfRepository<SearchDocument>(context, mediator);
        var document = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", url: null);
        context.SearchDocuments.Add(document);
        await context.SaveChangesAsync();

        var exists = await repository.ExistsAsync(document.Id);

        exists.Should().BeTrue();
    }

    [Fact]
    public async Task CountAsync_Should_Return_Count()
    {
        await using var context = CreateContext("repo-count");
        var mediator = Mock.Of<IMediator>();
        var repository = new EfRepository<SearchDocument>(context, mediator);
        context.SearchDocuments.Add(SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "T", "C", url: null));
        context.SearchDocuments.Add(SearchDocument.Create(Guid.NewGuid(), "ext-2", IndexSourceType.Page, "T", "C", url: null));
        await context.SaveChangesAsync();

        var all = await repository.GetAllAsync();

        all.Count.Should().Be(2);
    }

    [Fact]
    public async Task GetAsync_Should_Apply_Specification()
    {
        await using var context = CreateContext("repo-getasync");
        var mediator = Mock.Of<IMediator>();
        var repository = new EfRepository<SearchDocument>(context, mediator);
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "T", "C", url: null);
        context.SearchDocuments.Add(doc);
        await context.SaveChangesAsync();

        var spec = new SearchDocumentsByExternalIdSpec(doc.IndexId, "ext-1");
        var result = await repository.GetAsync(spec);

        result.Should().ContainSingle();
        result.First().ExternalId.Should().Be("ext-1");
    }

    [Fact]
    public async Task AnyAsync_Should_Return_True_When_Matching()
    {
        await using var context = CreateContext("repo-any");
        var mediator = Mock.Of<IMediator>();
        var repository = new EfRepository<SearchDocument>(context, mediator);
        var indexId = Guid.NewGuid();
        context.SearchDocuments.Add(SearchDocument.Create(indexId, "ext-1", IndexSourceType.Page, "T", "C", url: null));
        await context.SaveChangesAsync();

        var result = await repository.AnyAsync(new SearchDocumentsByExternalIdSpec(indexId, "ext-1"));

        result.Should().BeTrue();
    }
}

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

public class ContentSourceProviderTests
{
    [Fact]
    public async Task PagesContentSourceProvider_Should_Return_Empty_List()
    {
        var provider = new PagesContentSourceProvider();

        provider.SourceType.Should().Be(IndexSourceType.Page);
        var docs = await provider.GetDocumentsAsync(CancellationToken.None);

        docs.Should().BeEmpty();
    }

    [Fact]
    public async Task NavigationContentSourceProvider_Should_Return_Empty_List()
    {
        var provider = new NavigationContentSourceProvider();

        provider.SourceType.Should().Be(IndexSourceType.Navigation);
        var docs = await provider.GetDocumentsAsync(CancellationToken.None);

        docs.Should().BeEmpty();
    }

    [Fact]
    public async Task ProductContentSourceProvider_Should_Return_Empty_List()
    {
        var provider = new ProductContentSourceProvider();

        provider.SourceType.Should().Be(IndexSourceType.Product);
        var docs = await provider.GetDocumentsAsync(CancellationToken.None);

        docs.Should().BeEmpty();
    }

    [Fact]
    public async Task DocumentationContentSourceProvider_Should_Return_Empty_List()
    {
        var provider = new DocumentationContentSourceProvider();

        provider.SourceType.Should().Be(IndexSourceType.Documentation);
        var docs = await provider.GetDocumentsAsync(CancellationToken.None);

        docs.Should().BeEmpty();
    }

    [Fact]
    public async Task BlogContentSourceProvider_Should_Return_Empty_List()
    {
        var provider = new BlogContentSourceProvider();

        provider.SourceType.Should().Be(IndexSourceType.Blog);
        var docs = await provider.GetDocumentsAsync(CancellationToken.None);

        docs.Should().BeEmpty();
    }

    [Fact]
    public async Task MediaContentSourceProvider_Should_Return_Empty_List()
    {
        var provider = new MediaContentSourceProvider();

        provider.SourceType.Should().Be(IndexSourceType.Media);
        var docs = await provider.GetDocumentsAsync(CancellationToken.None);

        docs.Should().BeEmpty();
    }

    [Fact]
    public async Task FormContentSourceProvider_Should_Return_Empty_List()
    {
        var provider = new FormContentSourceProvider();

        provider.SourceType.Should().Be(IndexSourceType.Form);
        var docs = await provider.GetDocumentsAsync(CancellationToken.None);

        docs.Should().BeEmpty();
    }

    [Fact]
    public async Task UserContentSourceProvider_Should_Return_Empty_List()
    {
        var provider = new UserContentSourceProvider();

        provider.SourceType.Should().Be(IndexSourceType.User);
        var docs = await provider.GetDocumentsAsync(CancellationToken.None);

        docs.Should().BeEmpty();
    }

    [Fact]
    public async Task KnowledgeBaseContentSourceProvider_Should_Return_Empty_List()
    {
        var provider = new KnowledgeBaseContentSourceProvider();

        provider.SourceType.Should().Be(IndexSourceType.KnowledgeBase);
        var docs = await provider.GetDocumentsAsync(CancellationToken.None);

        docs.Should().BeEmpty();
    }
}

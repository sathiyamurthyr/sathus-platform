global using FluentAssertions;
global using Xunit;
global using Microsoft.Extensions.DependencyInjection;
global using Sathus.Search.Application.Interfaces;
global using Sathus.Search.Infrastructure.Extensions;
global using Sathus.Search.Infrastructure.Repositories;
global using Sathus.Search.Infrastructure.Services;
global using Sathus.Search.Infrastructure.Services.ContentSourceProviders;

namespace Sathus.Search.Tests.Infrastructure;

public class ServiceCollectionExtensionsTests
{
    [Fact]
    public void AddSearchInfrastructure_Should_Register_Services()
    {
        var services = new ServiceCollection();

        services.AddSearchInfrastructure("Host=localhost;Database=test");

        var descriptors = services.ToList();

        descriptors.Should().Contain(d => d.ServiceType == typeof(ISearchRepository) && d.ImplementationType == typeof(EfSearchRepository));
        descriptors.Should().Contain(d => d.ServiceType == typeof(ISearchProvider) && d.ImplementationType == typeof(PostgreSqlSearchProvider));
        descriptors.Should().Contain(d => d.ServiceType == typeof(ISearchIndexer) && d.ImplementationType == typeof(SearchIndexer));
        descriptors.Should().Contain(d => d.ServiceType == typeof(ISearchRanker) && d.ImplementationType == typeof(SearchRanker));
        descriptors.Should().Contain(d => d.ServiceType == typeof(ISearchPermissionProvider) && d.ImplementationType == typeof(SearchPermissionProvider));
    }

    [Fact]
    public void AddSearchInfrastructure_Should_Register_ContentSourceProviders()
    {
        var services = new ServiceCollection();

        services.AddSearchInfrastructure("Host=localhost;Database=test");

        var descriptors = services.ToList();

        descriptors.Should().Contain(d => d.ServiceType == typeof(IContentSourceProvider) && d.ImplementationType == typeof(PagesContentSourceProvider));
        descriptors.Should().Contain(d => d.ServiceType == typeof(IContentSourceProvider) && d.ImplementationType == typeof(NavigationContentSourceProvider));
        descriptors.Should().Contain(d => d.ServiceType == typeof(IContentSourceProvider) && d.ImplementationType == typeof(ProductContentSourceProvider));
        descriptors.Should().Contain(d => d.ServiceType == typeof(IContentSourceProvider) && d.ImplementationType == typeof(DocumentationContentSourceProvider));
        descriptors.Should().Contain(d => d.ServiceType == typeof(IContentSourceProvider) && d.ImplementationType == typeof(BlogContentSourceProvider));
        descriptors.Should().Contain(d => d.ServiceType == typeof(IContentSourceProvider) && d.ImplementationType == typeof(MediaContentSourceProvider));
        descriptors.Should().Contain(d => d.ServiceType == typeof(IContentSourceProvider) && d.ImplementationType == typeof(FormContentSourceProvider));
        descriptors.Should().Contain(d => d.ServiceType == typeof(IContentSourceProvider) && d.ImplementationType == typeof(UserContentSourceProvider));
        descriptors.Should().Contain(d => d.ServiceType == typeof(IContentSourceProvider) && d.ImplementationType == typeof(KnowledgeBaseContentSourceProvider));
    }
}

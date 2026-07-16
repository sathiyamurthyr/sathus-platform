global using FluentAssertions;
global using Xunit;
global using Sathus.Search.Application.Common;
global using Sathus.Search.Domain.Enums;

namespace Sathus.Search.Tests.Application;

public class ParsersTests
{
    [Theory]
    [InlineData("draft", DocumentStatus.Draft)]
    [InlineData("published", DocumentStatus.Published)]
    [InlineData("archived", DocumentStatus.Archived)]
    [InlineData("expired", DocumentStatus.Expired)]
    [InlineData("DRAFT", DocumentStatus.Draft)]
    [InlineData("Published", DocumentStatus.Published)]
    public void ParseDocumentStatus_Should_Parse_Valid_Values(string value, DocumentStatus expected)
    {
        var result = Parsers.ParseDocumentStatus(value);

        result.Should().Be(expected);
    }

    [Fact]
    public void ParseDocumentStatus_Should_Throw_On_Invalid_Value()
    {
        var act = () => Parsers.ParseDocumentStatus("unknown");

        act.Should().Throw<ArgumentException>().WithMessage("*Unknown document status*");
    }

    [Theory]
    [InlineData("page", IndexSourceType.Page)]
    [InlineData("product", IndexSourceType.Product)]
    [InlineData("documentation", IndexSourceType.Documentation)]
    [InlineData("blog", IndexSourceType.Blog)]
    [InlineData("media", IndexSourceType.Media)]
    [InlineData("navigation", IndexSourceType.Navigation)]
    [InlineData("form", IndexSourceType.Form)]
    [InlineData("user", IndexSourceType.User)]
    [InlineData("knowledgebase", IndexSourceType.KnowledgeBase)]
    [InlineData("PAGE", IndexSourceType.Page)]
    [InlineData("Product", IndexSourceType.Product)]
    public void ParseIndexSourceType_Should_Parse_Valid_Values(string value, IndexSourceType expected)
    {
        var result = Parsers.ParseIndexSourceType(value);

        result.Should().Be(expected);
    }

    [Fact]
    public void ParseIndexSourceType_Should_Throw_On_Invalid_Value()
    {
        var act = () => Parsers.ParseIndexSourceType("unknown");

        act.Should().Throw<ArgumentException>().WithMessage("*Unknown index source type*");
    }

    [Theory]
    [InlineData("postgresql", SearchProviderType.PostgreSQL)]
    [InlineData("meilisearch", SearchProviderType.Meilisearch)]
    [InlineData("opensearch", SearchProviderType.OpenSearch)]
    [InlineData("elasticsearch", SearchProviderType.Elasticsearch)]
    [InlineData("azureaisearch", SearchProviderType.AzureAiSearch)]
    [InlineData("PostgreSQL", SearchProviderType.PostgreSQL)]
    [InlineData("Elasticsearch", SearchProviderType.Elasticsearch)]
    public void ParseSearchProviderType_Should_Parse_Valid_Values(string value, SearchProviderType expected)
    {
        var result = Parsers.ParseSearchProviderType(value);

        result.Should().Be(expected);
    }

    [Fact]
    public void ParseSearchProviderType_Should_Throw_On_Invalid_Value()
    {
        var act = () => Parsers.ParseSearchProviderType("unknown");

        act.Should().Throw<ArgumentException>().WithMessage("*Unknown search provider type*");
    }
}

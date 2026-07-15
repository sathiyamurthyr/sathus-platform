global using FluentAssertions;
global using Xunit;
global using Sathus.Search.Domain.Exceptions;

namespace Sathus.Search.Tests.Domain.Exceptions;

public class SearchExceptionsTests
{
    [Fact]
    public void SearchIndexingException_Should_Have_Message()
    {
        var ex = new SearchIndexingException("index failed");

        ex.Message.Should().Be("index failed");
    }

    [Fact]
    public void SearchInvalidQueryException_Should_Have_Message()
    {
        var ex = new SearchInvalidQueryException("bad query");

        ex.Message.Should().Be("bad query");
    }

    [Fact]
    public void SearchProviderNotSupportedException_Should_Have_Formatted_Message()
    {
        var ex = new SearchProviderNotSupportedException("solr");

        ex.Message.Should().Be("Search provider 'solr' is not supported.");
    }
}

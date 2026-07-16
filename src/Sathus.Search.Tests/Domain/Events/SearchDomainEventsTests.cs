global using FluentAssertions;
global using Xunit;
global using Sathus.Search.Domain.Events;
global using Sathus.Search.Domain.Enums;

namespace Sathus.Search.Tests.Domain.Events;

public class SearchDomainEventsTests
{
    [Fact]
    public void SearchDocumentIndexedEvent_Should_Have_Correct_Properties()
    {
        var docId = Guid.NewGuid();
        var indexId = Guid.NewGuid();

        var evt = new SearchDocumentIndexedEvent(docId, indexId, "ext-1", IndexSourceType.Page);

        evt.DocumentId.Should().Be(docId);
        evt.IndexId.Should().Be(indexId);
        evt.ExternalId.Should().Be("ext-1");
        evt.SourceType.Should().Be(IndexSourceType.Page);
    }

    [Fact]
    public void SearchDocumentIndexedEvent_Should_Implement_IDomainEvent()
    {
        var evt = new SearchDocumentIndexedEvent(Guid.NewGuid(), Guid.NewGuid(), "ext-1", IndexSourceType.Page);

        evt.GetType().GetInterfaces().Should().Contain(typeof(Sathus.SharedKernel.Events.IDomainEvent));
    }

    [Fact]
    public void SearchIndexRebuiltEvent_Should_Have_Correct_Properties()
    {
        var indexId = Guid.NewGuid();

        var evt = new SearchIndexRebuiltEvent(indexId, 42);

        evt.IndexId.Should().Be(indexId);
        evt.DocumentCount.Should().Be(42);
    }

    [Fact]
    public void SearchIndexRebuiltEvent_Should_Implement_IDomainEvent()
    {
        var evt = new SearchIndexRebuiltEvent(Guid.NewGuid(), 0);

        evt.GetType().GetInterfaces().Should().Contain(typeof(Sathus.SharedKernel.Events.IDomainEvent));
    }
}

global using FluentAssertions;
global using Xunit;
global using Sathus.Search.Application.Specifications;
global using Sathus.Search.Domain.Entities;
global using Sathus.Search.Domain.Enums;
global using Sathus.Search.Domain.ValueObjects;

namespace Sathus.Search.Tests.Application.Specifications;

public class SearchSpecificationsTests
{
    [Fact]
    public void EnabledSearchIndexesSpec_Should_Filter_Enabled_Indexes()
    {
        var enabledIndex = SearchIndex.Create(Guid.NewGuid(), "Enabled", "EN");
        var disabledIndex = SearchIndex.Create(Guid.NewGuid(), "Disabled", "DI");
        disabledIndex.Disable();

        var spec = new EnabledSearchIndexesSpec();
        var result = spec.Criteria!.Compile()(enabledIndex);

        result.Should().BeTrue();
    }

    [Fact]
    public void EnabledSearchIndexesSpec_Should_Exclude_Deleted_Indexes()
    {
        var index = SearchIndex.Create(Guid.NewGuid(), "Index", "IDX");
        index.MarkDeleted(null, DateTime.UtcNow);

        var spec = new EnabledSearchIndexesSpec();
        var result = spec.Criteria!.Compile()(index);

        result.Should().BeFalse();
    }

    [Fact]
    public void EnabledSearchIndexesSpec_Should_Exclude_Disabled_Indexes()
    {
        var index = SearchIndex.Create(Guid.NewGuid(), "Index", "IDX");
        index.Disable();

        var spec = new EnabledSearchIndexesSpec();
        var result = spec.Criteria!.Compile()(index);

        result.Should().BeFalse();
    }

    [Fact]
    public void SearchDocumentsByIndexSpec_Should_Filter_By_IndexId_And_Not_Deleted()
    {
        var indexId = Guid.NewGuid();
        var doc = SearchDocument.Create(indexId, "ext-1", IndexSourceType.Page, "T", "C", null);

        var spec = new SearchDocumentsByIndexSpec(indexId);
        var result = spec.Criteria!.Compile()(doc);

        result.Should().BeTrue();
    }

    [Fact]
    public void SearchDocumentsByIndexSpec_Should_Exclude_Deleted_Documents()
    {
        var indexId = Guid.NewGuid();
        var doc = SearchDocument.Create(indexId, "ext-1", IndexSourceType.Page, "T", "C", null);
        doc.Delete(null);

        var spec = new SearchDocumentsByIndexSpec(indexId);
        var result = spec.Criteria!.Compile()(doc);

        result.Should().BeFalse();
    }

    [Fact]
    public void SearchDocumentsByIndexSpec_Should_Exclude_Other_Indexes()
    {
        var spec = new SearchDocumentsByIndexSpec(Guid.NewGuid());
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "T", "C", null);

        var result = spec.Criteria!.Compile()(doc);

        result.Should().BeFalse();
    }

    [Fact]
    public void SearchDocumentsBySourceTypeSpec_Should_Filter_By_SourceType()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Product, "T", "C", null);

        var spec = new SearchDocumentsBySourceTypeSpec(IndexSourceType.Product);
        var result = spec.Criteria!.Compile()(doc);

        result.Should().BeTrue();
    }

    [Fact]
    public void SearchDocumentsBySourceTypeSpec_Should_Exclude_Other_SourceTypes()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "T", "C", null);

        var spec = new SearchDocumentsBySourceTypeSpec(IndexSourceType.Product);
        var result = spec.Criteria!.Compile()(doc);

        result.Should().BeFalse();
    }

    [Fact]
    public void SearchDocumentsBySourceTypeSpec_Should_Exclude_Deleted_Documents()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Product, "T", "C", null);
        doc.Delete(null);

        var spec = new SearchDocumentsBySourceTypeSpec(IndexSourceType.Product);
        var result = spec.Criteria!.Compile()(doc);

        result.Should().BeFalse();
    }

    [Fact]
    public void SearchDocumentsByStatusSpec_Should_Filter_By_Status()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "T", "C", null);
        doc.Publish(DateTime.UtcNow, null);

        var spec = new SearchDocumentsByStatusSpec(DocumentStatus.Published);
        var result = spec.Criteria!.Compile()(doc);

        result.Should().BeTrue();
    }

    [Fact]
    public void SearchDocumentsByStatusSpec_Should_Exclude_Other_Statuses()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "T", "C", null);

        var spec = new SearchDocumentsByStatusSpec(DocumentStatus.Published);
        var result = spec.Criteria!.Compile()(doc);

        result.Should().BeFalse();
    }

    [Fact]
    public void SearchDocumentsByStatusSpec_Should_Exclude_Deleted_Documents()
    {
        var doc = SearchDocument.Create(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "T", "C", null);
        doc.Delete(null);

        var spec = new SearchDocumentsByStatusSpec(DocumentStatus.Draft);
        var result = spec.Criteria!.Compile()(doc);

        result.Should().BeFalse();
    }

    [Fact]
    public void SearchDocumentsByExternalIdSpec_Should_Filter_By_IndexId_And_ExternalId()
    {
        var indexId = Guid.NewGuid();
        var doc = SearchDocument.Create(indexId, "ext-1", IndexSourceType.Page, "T", "C", null);

        var spec = new SearchDocumentsByExternalIdSpec(indexId, "ext-1");
        var result = spec.Criteria!.Compile()(doc);

        result.Should().BeTrue();
    }

    [Fact]
    public void SearchDocumentsByExternalIdSpec_Should_Exclude_When_ExternalId_Does_Not_Match()
    {
        var indexId = Guid.NewGuid();
        var doc = SearchDocument.Create(indexId, "ext-1", IndexSourceType.Page, "T", "C", null);

        var spec = new SearchDocumentsByExternalIdSpec(indexId, "ext-2");
        var result = spec.Criteria!.Compile()(doc);

        result.Should().BeFalse();
    }

    [Fact]
    public void SearchDocumentsByExternalIdSpec_Should_Exclude_Deleted_Documents()
    {
        var indexId = Guid.NewGuid();
        var doc = SearchDocument.Create(indexId, "ext-1", IndexSourceType.Page, "T", "C", null);
        doc.Delete(null);

        var spec = new SearchDocumentsByExternalIdSpec(indexId, "ext-1");
        var result = spec.Criteria!.Compile()(doc);

        result.Should().BeFalse();
    }
}

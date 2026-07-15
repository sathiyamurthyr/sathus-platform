global using FluentAssertions;
global using Xunit;
global using Sathus.Search.Application.Commands.BulkIndex;
global using Sathus.Search.Application.Commands.DeleteDocument;
global using Sathus.Search.Application.Commands.IndexDocument;
global using Sathus.Search.Application.Commands.RebuildIndex;
global using Sathus.Search.Application.Queries.Search;
global using Sathus.Search.Application.Queries.Suggest;
global using Sathus.Search.Application.Validators;

namespace Sathus.Search.Tests.Application.Validators;

public class SearchValidatorsTests
{
    [Fact]
    public void IndexDocumentCommandValidator_Should_Pass_For_Valid_Command()
    {
        var validator = new IndexDocumentCommandValidator();
        var command = new IndexDocumentCommand(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content");

        var result = validator.Validate(command);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void IndexDocumentCommandValidator_Should_Fail_When_IndexId_Empty()
    {
        var validator = new IndexDocumentCommandValidator();
        var command = new IndexDocumentCommand(Guid.Empty, "ext-1", IndexSourceType.Page, "Title", "Content");

        var result = validator.Validate(command);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "IndexId");
    }

    [Fact]
    public void IndexDocumentCommandValidator_Should_Fail_When_ExternalId_Empty()
    {
        var validator = new IndexDocumentCommandValidator();
        var command = new IndexDocumentCommand(Guid.NewGuid(), "", IndexSourceType.Page, "Title", "Content");

        var result = validator.Validate(command);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "ExternalId");
    }

    [Fact]
    public void IndexDocumentCommandValidator_Should_Fail_When_Title_Empty()
    {
        var validator = new IndexDocumentCommandValidator();
        var command = new IndexDocumentCommand(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "", "Content");

        var result = validator.Validate(command);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Title");
    }

    [Fact]
    public void IndexDocumentCommandValidator_Should_Fail_When_Content_Empty()
    {
        var validator = new IndexDocumentCommandValidator();
        var command = new IndexDocumentCommand(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "");

        var result = validator.Validate(command);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Content");
    }

    [Fact]
    public void IndexDocumentCommandValidator_Should_Fail_When_Language_Too_Long()
    {
        var validator = new IndexDocumentCommandValidator();
        var command = new IndexDocumentCommand(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "Title", "Content", Language: new string('a', 11));

        var result = validator.Validate(command);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Language");
    }

    [Fact]
    public void DeleteDocumentCommandValidator_Should_Pass_For_Valid_Command()
    {
        var validator = new DeleteDocumentCommandValidator();
        var command = new DeleteDocumentCommand(Guid.NewGuid());

        var result = validator.Validate(command);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void DeleteDocumentCommandValidator_Should_Fail_When_DocumentId_Empty()
    {
        var validator = new DeleteDocumentCommandValidator();
        var command = new DeleteDocumentCommand(Guid.Empty);

        var result = validator.Validate(command);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "DocumentId");
    }

    [Fact]
    public void RebuildIndexCommandValidator_Should_Pass_For_Valid_Command()
    {
        var validator = new RebuildIndexCommandValidator();
        var command = new RebuildIndexCommand(Guid.NewGuid());

        var result = validator.Validate(command);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void RebuildIndexCommandValidator_Should_Fail_When_IndexId_Empty()
    {
        var validator = new RebuildIndexCommandValidator();
        var command = new RebuildIndexCommand(Guid.Empty);

        var result = validator.Validate(command);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "IndexId");
    }

    [Fact]
    public void BulkIndexCommandValidator_Should_Pass_For_Valid_Command()
    {
        var validator = new BulkIndexCommandValidator();
        var command = new BulkIndexCommand(Guid.NewGuid(), new List<BulkIndexItem>
        {
            new("ext-1", IndexSourceType.Page, "Title", "Content")
        });

        var result = validator.Validate(command);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void BulkIndexCommandValidator_Should_Fail_When_Items_Empty()
    {
        var validator = new BulkIndexCommandValidator();
        var command = new BulkIndexCommand(Guid.NewGuid(), Array.Empty<BulkIndexItem>());

        var result = validator.Validate(command);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Items");
    }

    [Fact]
    public void BulkIndexCommandValidator_Should_Fail_When_IndexId_Empty()
    {
        var validator = new BulkIndexCommandValidator();
        var command = new BulkIndexCommand(Guid.Empty, new List<BulkIndexItem>
        {
            new("ext-1", IndexSourceType.Page, "Title", "Content")
        });

        var result = validator.Validate(command);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "IndexId");
    }

    [Fact]
    public void BulkIndexItemValidator_Should_Fail_When_ExternalId_Empty()
    {
        var validator = new BulkIndexItemValidator();
        var item = new BulkIndexItem("", IndexSourceType.Page, "Title", "Content");

        var result = validator.Validate(item);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "ExternalId");
    }

    [Fact]
    public void BulkIndexItemValidator_Should_Fail_When_Title_Too_Long()
    {
        var validator = new BulkIndexItemValidator();
        var item = new BulkIndexItem("ext-1", IndexSourceType.Page, new string('a', 513), "Content");

        var result = validator.Validate(item);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Title");
    }

    [Fact]
    public void SearchQueryValidator_Should_Pass_For_Valid_Query()
    {
        var validator = new SearchQueryValidator();
        var query = new SearchQuery("search term", Pagination: Sathus.Search.Domain.ValueObjects.SearchPagination.Create(1, 20));

        var result = validator.Validate(query);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void SearchQueryValidator_Should_Fail_When_Query_Empty()
    {
        var validator = new SearchQueryValidator();
        var query = new SearchQuery("", Pagination: Sathus.Search.Domain.ValueObjects.SearchPagination.Create(1, 20));

        var result = validator.Validate(query);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Query");
    }

    [Fact]
    public void SearchQueryValidator_Should_Fail_When_Query_Too_Long()
    {
        var validator = new SearchQueryValidator();
        var query = new SearchQuery(new string('a', 1025), Pagination: Sathus.Search.Domain.ValueObjects.SearchPagination.Create(1, 20));

        var result = validator.Validate(query);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Query");
    }

    [Fact]
    public void SuggestQueryValidator_Should_Pass_For_Valid_Query()
    {
        var validator = new SuggestQueryValidator();
        var query = new SuggestQuery("suggest");

        var result = validator.Validate(query);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void SuggestQueryValidator_Should_Pass_For_Empty_Query()
    {
        var validator = new SuggestQueryValidator();
        var query = new SuggestQuery("");

        var result = validator.Validate(query);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void SuggestQueryValidator_Should_Fail_When_Limit_Greater_Than_20()
    {
        var validator = new SuggestQueryValidator();
        var query = new SuggestQuery("suggest", Limit: 21);

        var result = validator.Validate(query);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Limit");
    }
}

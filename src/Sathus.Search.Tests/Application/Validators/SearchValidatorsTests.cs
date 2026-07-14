namespace Sathus.Search.Tests.Validators;

public class SearchValidatorsTests
{
    private readonly IndexDocumentCommandValidator _indexValidator = new();
    private readonly SearchQueryValidator _searchValidator = new();

    [Fact]
    public void IndexDocumentCommandValidator_Should_Fail_On_Empty_IndexId()
    {
        var result = _indexValidator.Validate(new IndexDocumentCommand(Guid.Empty, "ext-1", IndexSourceType.Page, "Title", "Content"));

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "IndexId");
    }

    [Fact]
    public void IndexDocumentCommandValidator_Should_Fail_On_Empty_Title()
    {
        var result = _indexValidator.Validate(new IndexDocumentCommand(Guid.NewGuid(), "ext-1", IndexSourceType.Page, "", "Content"));

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Title");
    }

    [Fact]
    public void SearchQueryValidator_Should_Fail_On_Empty_Query()
    {
        var result = _searchValidator.Validate(new SearchQuery("", Pagination: SearchPagination.Create(1, 20)));

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Query");
    }
}

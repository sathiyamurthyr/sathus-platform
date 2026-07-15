global using FluentAssertions;
global using Xunit;
global using Sathus.Search.Domain.Entities;
global using Sathus.Search.Domain.ValueObjects;

namespace Sathus.Search.Tests.Domain.Entities;

public class SearchFacetTests
{
    [Fact]
    public void Constructor_Should_Throw_When_Name_Is_NullOrWhiteSpace()
    {
        var act = () => new SearchFacet(SearchFacetId.CreateUnique(), Guid.NewGuid(), "  ", "category", "terms", null);

        act.Should().Throw<ArgumentException>().WithMessage("*Name is required*");
    }

    [Fact]
    public void Constructor_Should_Throw_When_FieldName_Is_NullOrWhiteSpace()
    {
        var act = () => new SearchFacet(SearchFacetId.CreateUnique(), Guid.NewGuid(), "name", "  ", "terms", null);

        act.Should().Throw<ArgumentException>().WithMessage("*FieldName is required*");
    }

    [Fact]
    public void Constructor_Should_Throw_When_FacetType_Is_NullOrWhiteSpace()
    {
        var act = () => new SearchFacet(SearchFacetId.CreateUnique(), Guid.NewGuid(), "name", "field", "  ", null);

        act.Should().Throw<ArgumentException>().WithMessage("*FacetType is required*");
    }

    [Fact]
    public void Constructor_Should_Set_Properties()
    {
        var id = SearchFacetId.CreateUnique();
        var indexId = Guid.NewGuid();

        var facet = new SearchFacet(id, indexId, "category", "category", "terms", "{\"size\":10}");

        facet.Id.Should().Be(id);
        facet.IndexId.Should().Be(indexId);
        facet.Name.Should().Be("category");
        facet.FieldName.Should().Be("category");
        facet.FacetType.Should().Be("terms");
        facet.Settings.Should().Be("{\"size\":10}");
    }

    [Fact]
    public void Create_Should_Return_New_Facet()
    {
        var facet = SearchFacet.Create(SearchFacetId.CreateUnique(), Guid.NewGuid(), "brand", "brand", "terms");

        facet.Should().NotBeNull();
        facet.Name.Should().Be("brand");
    }

    [Fact]
    public void CreateUnique_Should_Generate_New_Id()
    {
        var facet = SearchFacet.CreateUnique(Guid.NewGuid(), "brand", "brand", "terms");

        facet.Id.Value.Should().NotBe(Guid.Empty);
        facet.Name.Should().Be("brand");
    }

    [Fact]
    public void Update_Should_Change_Fields()
    {
        var facet = SearchFacet.CreateUnique(Guid.NewGuid(), "old", "old_field", "terms");

        facet.Update("new", "new_field", "range", "{\"range\":{\"price\":{}}}");

        facet.Name.Should().Be("new");
        facet.FieldName.Should().Be("new_field");
        facet.FacetType.Should().Be("range");
        facet.Settings.Should().Be("{\"range\":{\"price\":{}}}");
    }

    [Fact]
    public void Update_Should_Keep_Original_When_Empty()
    {
        var facet = SearchFacet.CreateUnique(Guid.NewGuid(), "name", "field", "terms");

        facet.Update("  ", "  ", "  ", null);

        facet.Name.Should().Be("name");
        facet.FieldName.Should().Be("field");
        facet.FacetType.Should().Be("terms");
        facet.Settings.Should().BeNull();
    }
}

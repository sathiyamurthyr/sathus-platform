using Sathus.SharedKernel.Entities;

namespace Sathus.Search.Domain.Entities;

public sealed class SearchFacet : Entity<SearchFacetId>
{
    public Guid IndexId { get; private set; }
    public string Name { get; private set; }
    public string FieldName { get; private set; }
    public string FacetType { get; private set; }
    public string? Settings { get; private set; }

    public SearchFacet(SearchFacetId id, Guid indexId, string name, string fieldName, string facetType, string? settings) : base(id)
    {
        IndexId = indexId;
        Name = string.IsNullOrWhiteSpace(name) ? throw new ArgumentException("Name is required.", nameof(name)) : name;
        FieldName = string.IsNullOrWhiteSpace(fieldName) ? throw new ArgumentException("FieldName is required.", nameof(fieldName)) : fieldName;
        FacetType = string.IsNullOrWhiteSpace(facetType) ? throw new ArgumentException("FacetType is required.", nameof(facetType)) : facetType;
        Settings = settings;
    }

    public SearchFacet Update(string name, string fieldName, string facetType, string? settings)
    {
        Name = string.IsNullOrWhiteSpace(name) ? Name : name;
        FieldName = string.IsNullOrWhiteSpace(fieldName) ? FieldName : fieldName;
        FacetType = string.IsNullOrWhiteSpace(facetType) ? FacetType : facetType;
        Settings = settings;
        return this;
    }

    public static SearchFacet Create(SearchFacetId id, Guid indexId, string name, string fieldName, string facetType, string? settings = null)
        => new(id, indexId, name, fieldName, facetType, settings);

    public static SearchFacet CreateUnique(Guid indexId, string name, string fieldName, string facetType, string? settings = null)
        => new(SearchFacetId.CreateUnique(), indexId, name, fieldName, facetType, settings);

    private SearchFacet() { }
}

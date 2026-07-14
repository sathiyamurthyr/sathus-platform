using Sathus.Search.Domain.Enums;
using Sathus.Search.Domain.Events;
using Sathus.Search.Domain.Exceptions;
using Sathus.Search.Domain.ValueObjects;

namespace Sathus.Search.Domain.Entities;

public sealed class SearchFacet : Entity
{
    public Guid IndexId { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string FieldName { get; private set; } = string.Empty;
    public FacetType FacetType { get; private set; }
    public bool IsEnabled { get; private set; }
    public int SortOrder { get; private set; }
    public int Count { get; private set; }
    public string Settings { get; private set; } = "{}";
    public SearchFacetId FacetId => new(Id);

    private SearchFacet() { }

    public static SearchFacet Create(Guid indexId, string name, string fieldName, FacetType facetType, bool isEnabled = true)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Facet name is required.", nameof(name));
        if (string.IsNullOrWhiteSpace(fieldName)) throw new ArgumentException("Field name is required.", nameof(fieldName));
        if (indexId == Guid.Empty) throw new ArgumentException("IndexId is required.", nameof(indexId));

        return new SearchFacet
        {
            Id = Guid.NewGuid(),
            IndexId = indexId,
            Name = name.Trim(),
            FieldName = fieldName.Trim(),
            FacetType = facetType,
            IsEnabled = isEnabled,
            SortOrder = 0,
            Count = 0,
            Settings = JsonSerializer.Serialize(new { type = facetType.ToString().ToLowerInvariant() })
        };
    }

    public void Update(string name, string fieldName, FacetType facetType, bool isEnabled, int sortOrder)
    {
        Name = string.IsNullOrWhiteSpace(name) ? Name : name.Trim();
        FieldName = string.IsNullOrWhiteSpace(fieldName) ? FieldName : fieldName.Trim();
        FacetType = facetType;
        IsEnabled = isEnabled;
        SortOrder = sortOrder >= 0 ? sortOrder : SortOrder;
    }
}

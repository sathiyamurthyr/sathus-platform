using Sathus.Search.Domain.Enums;
using Sathus.Search.Domain.Events;
using Sathus.Search.Domain.Exceptions;
using Sathus.Search.Domain.ValueObjects;

namespace Sathus.Search.Domain.Entities;

public sealed class SearchField : Entity
{
    public Guid IndexId { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public SearchFieldType FieldType { get; private set; }
    public bool IsSearchable { get; private set; }
    public bool IsFilterable { get; private set; }
    public bool IsSortable { get; private set; }
    public bool IsFacetable { get; private set; }
    public bool IsHighlightable { get; private set; }
    public double Weight { get; private set; }
    public string Properties { get; private set; } = "{}";
    public SearchFieldId FieldId => new(Id);

    private SearchField() { }

    public static SearchField Create(Guid indexId, string name, SearchFieldType fieldType, bool isSearchable, bool isFilterable, bool isSortable, bool isFacetable, bool isHighlightable, double weight)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Field name is required.", nameof(name));
        if (indexId == Guid.Empty) throw new ArgumentException("IndexId is required.", nameof(indexId));

        return new SearchField
        {
            Id = Guid.NewGuid(),
            IndexId = indexId,
            Name = name.Trim(),
            FieldType = fieldType,
            IsSearchable = isSearchable,
            IsFilterable = isFilterable,
            IsSortable = isSortable,
            IsFacetable = isFacetable,
            IsHighlightable = isHighlightable,
            Weight = weight,
            Properties = JsonSerializer.Serialize(new { type = fieldType.ToString().ToLowerInvariant() })
        };
    }

    public void UpdateProperties(bool isSearchable, bool isFilterable, bool isSortable, bool isFacetable, bool isHighlightable, double weight)
    {
        IsSearchable = isSearchable;
        IsFilterable = isFilterable;
        IsSortable = isSortable;
        IsFacetable = isFacetable;
        IsHighlightable = isHighlightable;
        Weight = weight;
    }
}

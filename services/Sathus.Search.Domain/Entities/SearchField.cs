using Sathus.SharedKernel.Entities;

namespace Sathus.Search.Domain.Entities;

public sealed class SearchField : Entity<SearchFieldId>
{
    public Guid IndexId { get; private set; }
    public string Name { get; private set; }
    public string FieldType { get; private set; }
    public string? Properties { get; private set; }

    public SearchField(SearchFieldId id, Guid indexId, string name, string fieldType, string? properties) : base(id)
    {
        IndexId = indexId;
        Name = string.IsNullOrWhiteSpace(name) ? throw new ArgumentException("Name is required.", nameof(name)) : name;
        FieldType = string.IsNullOrWhiteSpace(fieldType) ? throw new ArgumentException("FieldType is required.", nameof(fieldType)) : fieldType;
        Properties = properties;
    }

    public SearchField Update(string name, string fieldType, string? properties)
    {
        Name = string.IsNullOrWhiteSpace(name) ? Name : name;
        FieldType = string.IsNullOrWhiteSpace(fieldType) ? FieldType : fieldType;
        Properties = properties;
        return this;
    }

    public static SearchField Create(SearchFieldId id, Guid indexId, string name, string fieldType, string? properties = null)
        => new(id, indexId, name, fieldType, properties);

    public static SearchField CreateUnique(Guid indexId, string name, string fieldType, string? properties = null)
        => new(SearchFieldId.CreateUnique(), indexId, name, fieldType, properties);

    private SearchField() { }
}

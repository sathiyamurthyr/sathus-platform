using Sathus.SharedKernel.Entities;

namespace Sathus.Search.Domain.Entities;

public sealed class SearchHighlight : Entity<SearchHighlightId>
{
    public Guid IndexId { get; private set; }
    public string FieldName { get; private set; }
    public string? Options { get; private set; }

    public SearchHighlight(SearchHighlightId id, Guid indexId, string fieldName, string? options) : base(id)
    {
        IndexId = indexId;
        FieldName = string.IsNullOrWhiteSpace(fieldName) ? throw new ArgumentException("FieldName is required.", nameof(fieldName)) : fieldName;
        Options = options;
    }

    public SearchHighlight Update(string fieldName, string? options)
    {
        FieldName = string.IsNullOrWhiteSpace(fieldName) ? FieldName : fieldName;
        Options = options;
        return this;
    }

    public static SearchHighlight Create(SearchHighlightId id, Guid indexId, string fieldName, string? options = null)
        => new(id, indexId, fieldName, options);

    public static SearchHighlight CreateUnique(Guid indexId, string fieldName, string? options = null)
        => new(SearchHighlightId.CreateUnique(), indexId, fieldName, options);

    private SearchHighlight() { }
}

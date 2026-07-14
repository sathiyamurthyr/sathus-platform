using Sathus.Search.Domain.Events;
using Sathus.Search.Domain.Exceptions;
using Sathus.Search.Domain.ValueObjects;

namespace Sathus.Search.Domain.Entities;

public sealed class SearchHighlight : Entity
{
    public Guid IndexId { get; private set; }
    public string FieldName { get; private set; } = string.Empty;
    public string PreTag { get; private set; } = "<mark>";
    public string PostTag { get; private set; } = "</mark>";
    public bool IsEnabled { get; private set; }
    public SearchHighlightId HighlightId => new(Id);

    private SearchHighlight() { }

    public static SearchHighlight Create(Guid indexId, string fieldName, string preTag, string postTag)
    {
        if (indexId == Guid.Empty) throw new ArgumentException("IndexId is required.", nameof(indexId));
        if (string.IsNullOrWhiteSpace(fieldName)) throw new ArgumentException("FieldName is required.", nameof(fieldName));

        return new SearchHighlight
        {
            Id = Guid.NewGuid(),
            IndexId = indexId,
            FieldName = fieldName.Trim(),
            PreTag = string.IsNullOrWhiteSpace(preTag) ? "<mark>" : preTag,
            PostTag = string.IsNullOrWhiteSpace(postTag) ? "</mark>" : postTag,
            IsEnabled = true
        };
    }

    public void Update(string fieldName, string preTag, string postTag, bool isEnabled)
    {
        FieldName = string.IsNullOrWhiteSpace(fieldName) ? FieldName : fieldName.Trim();
        PreTag = string.IsNullOrWhiteSpace(preTag) ? PreTag : preTag;
        PostTag = string.IsNullOrWhiteSpace(postTag) ? PostTag : postTag;
        IsEnabled = isEnabled;
    }
}

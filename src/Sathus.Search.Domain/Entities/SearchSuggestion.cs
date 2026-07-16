using Sathus.SharedKernel.Entities;

namespace Sathus.Search.Domain.Entities;

public sealed class SearchSuggestion : Entity<SearchSuggestionId>
{
    public Guid IndexId { get; private set; }
    public string Text { get; private set; }
    public int Count { get; private set; }
    public DateTime LastUsedAt { get; private set; }

    public SearchSuggestion(SearchSuggestionId id, Guid indexId, string text) : base(id)
    {
        IndexId = indexId;
        Text = string.IsNullOrWhiteSpace(text) ? throw new ArgumentException("Text is required.", nameof(text)) : text;
        Count = 0;
        LastUsedAt = DateTime.UtcNow;
    }

    public SearchSuggestion Increment()
    {
        Count++;
        LastUsedAt = DateTime.UtcNow;
        return this;
    }

    public SearchSuggestion Update(string text)
    {
        Text = string.IsNullOrWhiteSpace(text) ? Text : text;
        return this;
    }

    public static SearchSuggestion Create(SearchSuggestionId id, Guid indexId, string text)
        => new(id, indexId, text);

    private SearchSuggestion() { }
}

using Sathus.Search.Domain.Events;
using Sathus.Search.Domain.Exceptions;
using Sathus.Search.Domain.ValueObjects;

namespace Sathus.Search.Domain.Entities;

public sealed class SearchSuggestion : Entity
{
    public Guid IndexId { get; private set; }
    public string Text { get; private set; } = string.Empty;
    public string Type { get; private set; } = "keyword";
    public double Weight { get; private set; }
    public string Contexts { get; private set; } = "[]";
    public SearchSuggestionId SuggestionId => new(Id);

    private SearchSuggestion() { }

    public static SearchSuggestion Create(Guid indexId, string text, string type, double weight, string? contexts = null)
    {
        if (indexId == Guid.Empty) throw new ArgumentException("IndexId is required.", nameof(indexId));
        if (string.IsNullOrWhiteSpace(text)) throw new ArgumentException("Text is required.", nameof(text));

        return new SearchSuggestion
        {
            Id = Guid.NewGuid(),
            IndexId = indexId,
            Text = text.Trim(),
            Type = string.IsNullOrWhiteSpace(type) ? "keyword" : type.Trim().ToLowerInvariant(),
            Weight = weight,
            Contexts = contexts ?? "[]"
        };
    }

    public void Update(string text, string type, double weight, string? contexts)
    {
        Text = string.IsNullOrWhiteSpace(text) ? Text : text.Trim();
        Type = string.IsNullOrWhiteSpace(type) ? Type : type.Trim().ToLowerInvariant();
        Weight = weight;
        Contexts = contexts ?? Contexts;
    }
}

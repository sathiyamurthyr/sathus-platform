using Sathus.Search.Domain.Events;
using Sathus.Search.Domain.Exceptions;
using Sathus.Search.Domain.ValueObjects;

namespace Sathus.Search.Domain.Entities;

public sealed class SearchSynonym : Entity
{
    public Guid IndexId { get; private set; }
    public string From { get; private set; } = string.Empty;
    public string To { get; private set; } = string.Empty;
    public bool IsEnabled { get; private set; }
    public SearchSynonymId SynonymId => new(Id);

    private SearchSynonym() { }

    public static SearchSynonym Create(Guid indexId, string from, string to)
    {
        if (indexId == Guid.Empty) throw new ArgumentException("IndexId is required.", nameof(indexId));
        if (string.IsNullOrWhiteSpace(from)) throw new ArgumentException("From term is required.", nameof(from));
        if (string.IsNullOrWhiteSpace(to)) throw new ArgumentException("To term is required.", nameof(to));

        return new SearchSynonym
        {
            Id = Guid.NewGuid(),
            IndexId = indexId,
            From = from.Trim().ToLowerInvariant(),
            To = to.Trim().ToLowerInvariant(),
            IsEnabled = true
        };
    }

    public void Toggle(bool isEnabled)
    {
        IsEnabled = isEnabled;
    }
}

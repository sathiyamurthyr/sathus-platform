using Sathus.SharedKernel.Entities;

namespace Sathus.Search.Domain.Entities;

public sealed class SearchSynonym : Entity<SearchSynonymId>
{
    public Guid IndexId { get; private set; }
    public string From { get; private set; }
    public string To { get; private set; }

    public SearchSynonym(SearchSynonymId id, Guid indexId, string from, string to) : base(id)
    {
        IndexId = indexId;
        From = string.IsNullOrWhiteSpace(from) ? throw new ArgumentException("From is required.", nameof(from)) : from;
        To = string.IsNullOrWhiteSpace(to) ? throw new ArgumentException("To is required.", nameof(to)) : to;
    }

    public SearchSynonym Update(string from, string to)
    {
        From = string.IsNullOrWhiteSpace(from) ? From : from;
        To = string.IsNullOrWhiteSpace(to) ? To : to;
        return this;
    }

    public static SearchSynonym Create(SearchSynonymId id, Guid indexId, string from, string to)
        => new(id, indexId, from, to);

    public static SearchSynonym CreateUnique(Guid indexId, string from, string to)
        => new(SearchSynonymId.CreateUnique(), indexId, from, to);

    private SearchSynonym() { }
}

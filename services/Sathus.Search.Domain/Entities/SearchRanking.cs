using Sathus.SharedKernel.Entities;

namespace Sathus.Search.Domain.Entities;

public sealed class SearchRanking : Entity<SearchRankingId>
{
    public Guid IndexId { get; private set; }
    public string Name { get; private set; }
    public string Query { get; private set; }
    public double Boost { get; private set; }

    public SearchRanking(SearchRankingId id, Guid indexId, string name, string query, double boost = 1.0) : base(id)
    {
        IndexId = indexId;
        Name = string.IsNullOrWhiteSpace(name) ? throw new ArgumentException("Name is required.", nameof(name)) : name;
        Query = string.IsNullOrWhiteSpace(query) ? throw new ArgumentException("Query is required.", nameof(query)) : query;
        Boost = boost;
    }

    public SearchRanking Update(string name, string query, double boost)
    {
        Name = string.IsNullOrWhiteSpace(name) ? Name : name;
        Query = string.IsNullOrWhiteSpace(query) ? Query : query;
        Boost = boost;
        return this;
    }

    public static SearchRanking Create(SearchRankingId id, Guid indexId, string name, string query, double boost = 1.0)
        => new(id, indexId, name, query, boost);

    public static SearchRanking CreateUnique(Guid indexId, string name, string query, double boost = 1.0)
        => new(SearchRankingId.CreateUnique(), indexId, name, query, boost);

    private SearchRanking() { }
}

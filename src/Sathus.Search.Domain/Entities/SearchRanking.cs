using Sathus.Search.Domain.Events;
using Sathus.Search.Domain.Exceptions;
using Sathus.Search.Domain.ValueObjects;

namespace Sathus.Search.Domain.Entities;

public sealed class SearchRanking : Entity
{
    public Guid IndexId { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string Query { get; private set; } = string.Empty;
    public double Boost { get; private set; }
    public int Priority { get; private set; }
    public bool IsEnabled { get; private set; }
    public SearchRankingId RankingId => new(Id);

    private SearchRanking() { }

    public static SearchRanking Create(Guid indexId, string name, string query, double boost, int priority)
    {
        if (indexId == Guid.Empty) throw new ArgumentException("IndexId is required.", nameof(indexId));
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Name is required.", nameof(name));
        if (string.IsNullOrWhiteSpace(query)) throw new ArgumentException("Query is required.", nameof(query));
        if (boost <= 0) throw new ArgumentException("Boost must be greater than zero.", nameof(boost));

        return new SearchRanking
        {
            Id = Guid.NewGuid(),
            IndexId = indexId,
            Name = name.Trim(),
            Query = query.Trim(),
            Boost = boost,
            Priority = priority,
            IsEnabled = true
        };
    }

    public void Update(string name, string query, double boost, int priority, bool isEnabled)
    {
        Name = string.IsNullOrWhiteSpace(name) ? Name : name.Trim();
        Query = string.IsNullOrWhiteSpace(query) ? Query : query.Trim();
        Boost = boost > 0 ? boost : Boost;
        Priority = priority;
        IsEnabled = isEnabled;
    }
}

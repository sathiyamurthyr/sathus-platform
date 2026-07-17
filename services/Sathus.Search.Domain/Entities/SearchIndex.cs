using Sathus.Search.Domain.Events;
using Sathus.SharedKernel.Entities;

namespace Sathus.Search.Domain.Entities;

public sealed class SearchIndex : AggregateRoot
{
    public string Name { get; private set; }
    public string Code { get; private set; }
    public bool IsEnabled { get; private set; }
    public bool IsRebuilding { get; private set; }
    public DateTime? LastBuiltAt { get; private set; }
    public string? Settings { get; private set; }

    public IReadOnlyList<SearchField> Fields => _fields.AsReadOnly();
    public IReadOnlyList<SearchFacet> Facets => _facets.AsReadOnly();
    public IReadOnlyList<SearchSynonym> Synonyms => _synonyms.AsReadOnly();
    public IReadOnlyList<SearchRanking> Rankings => _rankings.AsReadOnly();
    public IReadOnlyList<SearchHighlight> Highlights => _highlights.AsReadOnly();

    private readonly List<SearchField> _fields = new();
    private readonly List<SearchFacet> _facets = new();
    private readonly List<SearchSynonym> _synonyms = new();
    private readonly List<SearchRanking> _rankings = new();
    private readonly List<SearchHighlight> _highlights = new();

    public SearchIndex(Guid id, string name, string code) : base(id)
    {
        Name = string.IsNullOrWhiteSpace(name) ? throw new ArgumentException("Name is required.", nameof(name)) : name;
        Code = string.IsNullOrWhiteSpace(code) ? throw new ArgumentException("Code is required.", nameof(code)) : code;
        IsEnabled = true;
        IsRebuilding = false;
        Settings = string.Empty;
    }

    public static SearchIndex Create(Guid id, string name, string code)
    {
        var index = new SearchIndex(id, name, code);
        index.AddDomainEvent(new SearchIndexCreatedEvent(id, name, code));
        return index;
    }

    public SearchIndex Enable() { IsEnabled = true; SetUpdateAudit(null, DateTime.UtcNow); return this; }
    public SearchIndex Disable() { IsEnabled = false; SetUpdateAudit(null, DateTime.UtcNow); return this; }
    public SearchIndex SetRebuilding(bool rebuilding) { IsRebuilding = rebuilding; SetUpdateAudit(null, DateTime.UtcNow); return this; }
    public SearchIndex SetLastBuiltAt(DateTime? date) { LastBuiltAt = date; SetUpdateAudit(null, DateTime.UtcNow); return this; }
    public SearchIndex SetSettings(string? settings) { Settings = settings; SetUpdateAudit(null, DateTime.UtcNow); return this; }
    public SearchIndex Update(string name, string code) { Name = name; Code = code; SetUpdateAudit(null, DateTime.UtcNow); return this; }

    public SearchField AddField(string name, string fieldType, string? properties = null)
    {
        var field = SearchField.CreateUnique(Id, name, fieldType, properties);
        _fields.Add(field);
        return field;
    }

    public SearchFacet AddFacet(string name, string fieldName, string facetType, string? settings = null)
    {
        var facet = SearchFacet.CreateUnique(Id, name, fieldName, facetType, settings);
        _facets.Add(facet);
        return facet;
    }

    public SearchSynonym AddSynonym(string from, string to)
    {
        var synonym = SearchSynonym.CreateUnique(Id, from, to);
        _synonyms.Add(synonym);
        return synonym;
    }

    public SearchRanking AddRanking(string name, string query)
    {
        var ranking = SearchRanking.CreateUnique(Id, name, query);
        _rankings.Add(ranking);
        return ranking;
    }

    public SearchHighlight AddHighlight(string fieldName, string? options = null)
    {
        var highlight = SearchHighlight.CreateUnique(Id, fieldName, options);
        _highlights.Add(highlight);
        return highlight;
    }

    private SearchIndex() { }
}

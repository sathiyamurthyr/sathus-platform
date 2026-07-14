using Sathus.Search.Domain.Enums;
using Sathus.Search.Domain.Events;
using Sathus.Search.Domain.Exceptions;
using Sathus.Search.Domain.ValueObjects;

namespace Sathus.Search.Domain.Entities;

public sealed class SearchIndex : AggregateRoot
{
    public string Name { get; private set; } = string.Empty;
    public string Code { get; private set; } = string.Empty;
    public bool IsDefault { get; private set; }
    public bool IsEnabled { get; private set; }
    public SearchProviderType Provider { get; private set; }
    public string? RebuildSchedule { get; private set; }
    public DateTime? LastRebuildAt { get; private set; }
    public string Settings { get; private set; } = "{}";
    public ICollection<SearchField> Fields { get; } = new List<SearchField>();
    public ICollection<SearchFacet> Facets { get; } = new List<SearchFacet>();
    public ICollection<SearchSynonym> Synonyms { get; } = new List<SearchSynonym>();
    public ICollection<SearchRanking> Rankings { get; } = new List<SearchRanking>();
    public ICollection<SearchHighlight> Highlights { get; } = new List<SearchHighlight>();
    public SearchIndexId IndexId => new(Id);

    private SearchIndex() { }

    public static SearchIndex Create(string name, string code, SearchProviderType provider, bool isDefault = false)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Index name is required.", nameof(name));
        if (string.IsNullOrWhiteSpace(code)) throw new ArgumentException("Index code is required.", nameof(code));

        var index = new SearchIndex
        {
            Id = Guid.NewGuid(),
            Name = name.Trim(),
            Code = code.Trim().ToLowerInvariant(),
            IsDefault = isDefault,
            IsEnabled = true,
            Provider = provider,
            Settings = JsonSerializer.Serialize(new { analyzer = "english" })
        };

        index.AddDomainEvent(new SearchIndexCreatedEvent(index.Id, index.Code));
        return index;
    }

    public void UpdateSettings(string settings, Guid? updatedBy)
    {
        Settings = settings;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    public void Enable(Guid? updatedBy)
    {
        if (IsEnabled) return;
        IsEnabled = true;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
        AddDomainEvent(new SearchIndexUpdatedEvent(Id, "enabled"));
    }

    public void Disable(Guid? updatedBy)
    {
        if (!IsEnabled) return;
        IsEnabled = false;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
        AddDomainEvent(new SearchIndexUpdatedEvent(Id, "disabled"));
    }

    public void RecordRebuild(DateTime rebuiltAt, Guid? updatedBy)
    {
        LastRebuildAt = rebuiltAt;
        SetUpdateAudit(updatedBy, rebuiltAt);
        AddDomainEvent(new SearchIndexRebuiltEvent(Id, Code));
    }

    public SearchField AddField(string name, SearchFieldType fieldType, bool isSearchable = true, bool isFilterable = true, bool isSortable = true, bool isFacetable = true, bool isHighlightable = true, double weight = 1.0)
    {
        var field = SearchField.Create(Id, name, fieldType, isSearchable, isFilterable, isSortable, isFacetable, isHighlightable, weight);
        Fields.Add(field);
        AddDomainEvent(new SearchFieldAddedEvent(Id, field.Id, field.Name));
        return field;
    }

    public SearchSynonym AddSynonym(string from, string to)
    {
        var synonym = SearchSynonym.Create(Id, from, to);
        Synonyms.Add(synonym);
        return synonym;
    }

    public SearchRanking AddRanking(string name, string query, double boost, int priority)
    {
        var ranking = SearchRanking.Create(Id, name, query, boost, priority);
        Rankings.Add(ranking);
        return ranking;
    }

    public SearchHighlight AddHighlight(string fieldName, string preTag, string postTag)
    {
        var highlight = SearchHighlight.Create(Id, fieldName, preTag, postTag);
        Highlights.Add(highlight);
        return highlight;
    }

    public SearchFacet AddFacet(string name, string fieldName, FacetType facetType, bool isEnabled = true)
    {
        var facet = SearchFacet.Create(Id, name, fieldName, facetType, isEnabled);
        Facets.Add(facet);
        return facet;
    }
}

namespace Sathus.Search.Domain;

public class SearchOptions
{
    public const string SectionName = "Search";
    public string DefaultIndex { get; set; } = "default";
    public int MaxResultCount { get; set; } = 50;
    public int SuggestLimit { get; set; } = 8;
    public int FacetLimit { get; set; } = 20;
    public int HighlightFragmentLength { get; set; } = 150;
    public string HighlightPreTag { get; set; } = "<mark>";
    public string HighlightPostTag { get; set; } = "</mark>";
    public int MinimumSimilarity { get; set; } = 3;
    public TimeSpan CacheDuration { get; set; } = TimeSpan.FromMinutes(2);
}

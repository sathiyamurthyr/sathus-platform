namespace Sathus.Media.Application.Interfaces;

/// <summary>
/// Criteria used to search the media catalogue.
/// </summary>
public sealed record MediaSearchCriteria(
    string? Term = null,
    IReadOnlyList<string>? Types = null,
    IReadOnlyList<string>? Tags = null,
    Guid? FolderId = null,
    string? Status = null,
    string? Language = null,
    DateTime? From = null,
    DateTime? To = null,
    string SortBy = "relevance",
    bool Descending = true,
    int Page = 1,
    int PageSize = 25)
{
    public int Skip => (Math.Max(1, Page) - 1) * Math.Max(1, PageSize);

    public int Take => Math.Max(1, PageSize);
}

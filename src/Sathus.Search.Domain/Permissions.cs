namespace Sathus.Search.Domain;

public static class SearchPermissions
{
    public const string Read = "search.read";
    public const string Manage = "search.manage";
    public const string Reindex = "search.reindex";

    public static readonly IReadOnlyList<string> All = new[] { Read, Manage, Reindex };
}

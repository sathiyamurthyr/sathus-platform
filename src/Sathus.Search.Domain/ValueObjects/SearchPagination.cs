namespace Sathus.Search.Domain.ValueObjects;

public sealed class SearchPagination
{
    public int Page { get; private set; }
    public int PageSize { get; private set; }

    public SearchPagination(int page, int pageSize)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 20;
        if (pageSize > 100) pageSize = 100;

        Page = page;
        PageSize = pageSize;
    }

    public int Offset => (Page - 1) * PageSize;

    public static SearchPagination Create(int page, int pageSize) => new(page, pageSize);
}

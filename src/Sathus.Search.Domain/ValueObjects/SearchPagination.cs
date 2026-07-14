namespace Sathus.Search.Domain.ValueObjects;

public sealed record SearchPagination(int Page, int PageSize)
{
    public int Offset => (Page - 1) * PageSize;
    public static SearchPagination Create(int page, int pageSize)
    {
        if (page < 1) throw new ArgumentException("Page must be >= 1.", nameof(page));
        if (pageSize < 1 || pageSize > 100) throw new ArgumentException("PageSize must be between 1 and 100.", nameof(pageSize));
        return new SearchPagination(page, pageSize);
    }
}

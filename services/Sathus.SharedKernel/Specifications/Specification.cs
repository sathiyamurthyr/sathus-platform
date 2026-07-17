using System.Linq.Expressions;

namespace Sathus.SharedKernel.Specifications;

/// <summary>
/// Base class for specifications. Derived specifications compose criteria, includes,
/// ordering and paging through the protected helpers.
/// </summary>
public abstract class Specification<T> : ISpecification<T>
{
    public Expression<Func<T, bool>>? Criteria { get; protected set; }

    public List<Expression<Func<T, object>>> Includes { get; } = new();

    public List<string> IncludeStrings { get; } = new();

    public Expression<Func<T, object>>? OrderBy { get; private set; }

    public Expression<Func<T, object>>? OrderByDescending { get; private set; }

    public Expression<Func<T, object>>? GroupBy { get; private set; }

    public int Take { get; private set; }

    public int Skip { get; private set; }

    public bool IsPagingEnabled { get; private set; }

    public bool AsNoTracking { get; protected set; } = true;

    protected void AddCriteria(Expression<Func<T, bool>> expression) => Criteria = expression;

    protected void AddInclude(Expression<Func<T, object>> include) => Includes.Add(include);

    protected void AddInclude(string include) => IncludeStrings.Add(include);

    protected void ApplyOrderBy(Expression<Func<T, object>> orderBy)
    {
        OrderBy = orderBy;
        OrderByDescending = null;
    }

    protected void ApplyOrderByDescending(Expression<Func<T, object>> orderByDescending)
    {
        OrderByDescending = orderByDescending;
        OrderBy = null;
    }

    protected void ApplyGroupBy(Expression<Func<T, object>> groupBy) => GroupBy = groupBy;

    protected void ApplyPaging(int skip, int take)
    {
        Skip = skip;
        Take = take;
        IsPagingEnabled = true;
    }
}

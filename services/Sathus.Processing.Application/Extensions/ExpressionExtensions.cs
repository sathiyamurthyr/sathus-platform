using System.Linq.Expressions;

namespace Sathus.Processing.Application.Extensions;

internal static class ExpressionExtensions
{
    public static Expression<Func<T, bool>> AndAlso<T>(
        this Expression<Func<T, bool>> left,
        Expression<Func<T, bool>> right)
    {
        var parameter = Expression.Parameter(typeof(T));
        var leftVisitor = new ReplaceParameterVisitor(left.Parameters[0], parameter);
        var rightVisitor = new ReplaceParameterVisitor(right.Parameters[0], parameter);

        var leftBody = leftVisitor.Visit(left.Body);
        var rightBody = rightVisitor.Visit(right.Body);

        return Expression.Lambda<Func<T, bool>>(
            Expression.AndAlso(leftBody!, rightBody!), parameter);
    }

    private sealed class ReplaceParameterVisitor : ExpressionVisitor
    {
        private readonly ParameterExpression _old;
        private readonly ParameterExpression _replacement;

        public ReplaceParameterVisitor(ParameterExpression old, ParameterExpression replacement)
        {
            _old = old;
            _replacement = replacement;
        }

        protected override Expression VisitParameter(ParameterExpression node) =>
            node == _old ? _replacement : base.VisitParameter(node);
    }
}

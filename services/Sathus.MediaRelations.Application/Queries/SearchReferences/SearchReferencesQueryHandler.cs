using System.Linq.Expressions;
using MediatR;
using Sathus.MediaRelations.Application.DTOs;
using Sathus.MediaRelations.Application.Interfaces;
using Sathus.MediaRelations.Domain.Entities;
using Sathus.MediaRelations.Domain.Enums;
using Sathus.SharedKernel.Paging;
using Sathus.SharedKernel.Specifications;

namespace Sathus.MediaRelations.Application.Queries.SearchReferences;

public sealed class SearchReferencesQueryHandler
    : IRequestHandler<SearchReferencesQuery, PagedResult<MediaReferenceResponse>>
{
    private readonly IMediaReferenceRepository _references;

    public SearchReferencesQueryHandler(IMediaReferenceRepository references)
    {
        _references = references;
    }

    public async Task<PagedResult<MediaReferenceResponse>> Handle(SearchReferencesQuery request, CancellationToken cancellationToken)
    {
        var page = request.Page < 1 ? 1 : request.Page;
        var pageSize = request.PageSize is < 1 or > 500 ? 50 : request.PageSize;

        var countSpec = new SearchReferencesSpecification(request, paged: false, 0, 0);
        var total = await _references.CountAsync(countSpec, cancellationToken);

        var pageSpec = new SearchReferencesSpecification(request, paged: true, (page - 1) * pageSize, pageSize);
        var items = await _references.GetAsync(pageSpec, cancellationToken);

        return new PagedResult<MediaReferenceResponse>(
            items.Select(MediaReferenceResponse.From).ToList(),
            page,
            pageSize,
            total);
    }
}

public sealed class SearchReferencesSpecification : Specification<MediaReference>
{
    public SearchReferencesSpecification(SearchReferencesQuery q, bool paged, int skip, int take)
    {
        Expression<Func<MediaReference, bool>> criteria = r => true;

        if (q.AssetId is { } assetId)
        {
            criteria = And(criteria, r => r.AssetId == assetId);
        }

        if (!string.IsNullOrWhiteSpace(q.ReferenceType))
        {
            var type = q.ReferenceType.Trim().ToLowerInvariant();
            criteria = And(criteria, r => r.ReferenceType.Value == type);
        }

        if (!string.IsNullOrWhiteSpace(q.Module))
        {
            var module = q.Module.Trim().ToLowerInvariant();
            criteria = And(criteria, r => r.Module.ToLower() == module);
        }

        if (!string.IsNullOrWhiteSpace(q.SourceReferenceId))
        {
            var source = q.SourceReferenceId.Trim();
            criteria = And(criteria, r => r.SourceReferenceId.Value == source);
        }

        if (!string.IsNullOrWhiteSpace(q.UsageType))
        {
            var usage = q.UsageType.Trim().ToLowerInvariant();
            criteria = And(criteria, r => r.UsageType.Value == usage);
        }

        if (!string.IsNullOrWhiteSpace(q.Scope))
        {
            var scope = q.Scope.Trim().ToLowerInvariant();
            criteria = And(criteria, r => r.Scope.Value == scope);
        }

        if (!string.IsNullOrWhiteSpace(q.Status) && Enum.TryParse<ReferenceStatus>(q.Status, ignoreCase: true, out var status))
        {
            criteria = And(criteria, r => r.Status == status);
        }
        else
        {
            criteria = And(criteria, r => r.Status != ReferenceStatus.Removed);
        }

        AddCriteria(criteria);
        ApplyOrderByDescending(r => r.UpdatedAt);

        if (paged)
        {
            ApplyPaging(skip, take);
        }
    }

    private static Expression<Func<MediaReference, bool>> And(
        Expression<Func<MediaReference, bool>> left,
        Expression<Func<MediaReference, bool>> right)
    {
        var parameter = Expression.Parameter(typeof(MediaReference), "r");
        var body = Expression.AndAlso(
            new ReplaceParameterVisitor(left.Parameters[0], parameter).Visit(left.Body)!,
            new ReplaceParameterVisitor(right.Parameters[0], parameter).Visit(right.Body)!);
        return Expression.Lambda<Func<MediaReference, bool>>(body, parameter);
    }

    private sealed class ReplaceParameterVisitor : ExpressionVisitor
    {
        private readonly ParameterExpression _from;
        private readonly ParameterExpression _to;

        public ReplaceParameterVisitor(ParameterExpression from, ParameterExpression to)
        {
            _from = from;
            _to = to;
        }

        protected override Expression VisitParameter(ParameterExpression node) =>
            node == _from ? _to : base.VisitParameter(node);
    }
}

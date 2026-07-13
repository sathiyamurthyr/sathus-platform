using MediatR;
using Sathus.Navigation.Application.DTOs;
using Sathus.Navigation.Application.Interfaces;
using Sathus.Navigation.Domain.Exceptions;

namespace Sathus.Navigation.Application.Queries.GetVersions;

public sealed record GetVersionsQuery(Guid MenuId) : IRequest<IReadOnlyList<VersionDto>>;

public sealed class GetVersionsQueryHandler : IRequestHandler<GetVersionsQuery, IReadOnlyList<VersionDto>>
{
    private readonly INavigationMenuRepository _repository;

    public GetVersionsQueryHandler(INavigationMenuRepository repository) => _repository = repository;

    public async Task<IReadOnlyList<VersionDto>> Handle(GetVersionsQuery request, CancellationToken cancellationToken)
    {
        var versions = await _repository.GetVersionsAsync(request.MenuId, cancellationToken);
        return versions.Select(v => new VersionDto(v.Id, v.VersionNumber, v.Label, v.Status.ToString(),
            v.CreatedBy, v.CreatedAt, v.PublishedAt, v.ScheduledAt, v.IsCurrent)).ToList();
    }
}

public sealed record GetHistoryQuery(Guid TreeId, Guid? MenuId = null) : IRequest<IReadOnlyList<HistoryDto>>;

public sealed class GetHistoryQueryHandler : IRequestHandler<GetHistoryQuery, IReadOnlyList<HistoryDto>>
{
    private readonly INavigationTreeRepository _repository;

    public GetHistoryQueryHandler(INavigationTreeRepository repository) => _repository = repository;

    public async Task<IReadOnlyList<HistoryDto>> Handle(GetHistoryQuery request, CancellationToken cancellationToken)
    {
        var tree = await _repository.GetByIdAsync(request.TreeId, cancellationToken)
            ?? throw new NavigationTreeNotFoundException(request.TreeId);

        var history = tree.History
            .Where(h => request.MenuId is null || h.MenuId == request.MenuId)
            .OrderByDescending(h => h.OccurredAt)
            .Select(h => new HistoryDto(h.Id, h.Operation.ToString(), h.MenuId, h.ActorId, h.Payload, h.OccurredAt, h.VersionId))
            .ToList();

        return history;
    }
}

public sealed record GetRedirectsQuery(Guid MenuId) : IRequest<IReadOnlyList<RedirectDto>>;

public sealed class GetRedirectsQueryHandler : IRequestHandler<GetRedirectsQuery, IReadOnlyList<RedirectDto>>
{
    private readonly INavigationTreeRepository _repository;

    public GetRedirectsQueryHandler(INavigationTreeRepository repository) => _repository = repository;

    public async Task<IReadOnlyList<RedirectDto>> Handle(GetRedirectsQuery request, CancellationToken cancellationToken)
    {
        var menu = await _repository.GetMenuAsync(request.MenuId, cancellationToken)
            ?? throw new NavigationMenuNotFoundException(request.MenuId);

        var tree = await _repository.GetByIdAsync(menu.TreeId, cancellationToken);
        var redirects = (tree?.Redirects ?? Enumerable.Empty<NavigationRedirect>())
            .Where(r => r.MenuId == request.MenuId)
            .Select(r => new RedirectDto(r.Id, r.MenuId, r.SourcePath, r.TargetPath, (int)r.RedirectType,
                r.Locale, r.Priority, r.IsEnabled))
            .ToList();

        return redirects;
    }
}

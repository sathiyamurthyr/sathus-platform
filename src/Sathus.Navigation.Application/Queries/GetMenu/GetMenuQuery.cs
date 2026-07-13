using MediatR;
using Sathus.Navigation.Application.DTOs;
using Sathus.Navigation.Application.Interfaces;
using Sathus.Navigation.Domain.Exceptions;

namespace Sathus.Navigation.Application.Queries.GetMenu;

public sealed record GetMenuQuery(Guid MenuId) : IRequest<MenuDetailDto>;

public sealed class GetMenuQueryHandler : IRequestHandler<GetMenuQuery, MenuDetailDto>
{
    private readonly INavigationMenuRepository _repository;

    public GetMenuQueryHandler(INavigationMenuRepository repository) => _repository = repository;

    public async Task<MenuDetailDto> Handle(GetMenuQuery request, CancellationToken cancellationToken)
    {
        var menu = await _repository.GetWithNodesAsync(request.MenuId, cancellationToken)
            ?? throw new NavigationMenuNotFoundException(request.MenuId);

        return MenuDetailDto.From(menu);
    }
}

public sealed record ListMenusQuery(Guid TreeId) : IRequest<IReadOnlyList<MenuSummaryDto>>;

public sealed class ListMenusQueryHandler : IRequestHandler<ListMenusQuery, IReadOnlyList<MenuSummaryDto>>
{
    private readonly INavigationTreeRepository _repository;

    public ListMenusQueryHandler(INavigationTreeRepository repository) => _repository = repository;

    public async Task<IReadOnlyList<MenuSummaryDto>> Handle(ListMenusQuery request, CancellationToken cancellationToken)
    {
        var tree = await _repository.GetWithMenusAsync(request.TreeId, cancellationToken)
            ?? throw new NavigationTreeNotFoundException(request.TreeId);

        return tree.Menus.Select(m => new MenuSummaryDto(
            m.Id, m.Name, m.Type.Value, m.Locale, m.Status.ToString(),
            TreeSummaryDto.CountNodes(m), m.PublishedVersionId, m.ScheduledPublishAt)).ToList();
    }
}

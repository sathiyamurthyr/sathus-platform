using MediatR;
using Sathus.Navigation.Application.DTOs;
using Sathus.Navigation.Application.Interfaces;
using Sathus.Navigation.Domain.Exceptions;

namespace Sathus.Navigation.Application.Queries.GetPublishedMenu;

public sealed record GetPublishedMenuQuery(Guid TreeId, string MenuType, string Locale) : IRequest<IReadOnlyList<NavigationItemDto>>;

public sealed class GetPublishedMenuQueryHandler : IRequestHandler<GetPublishedMenuQuery, IReadOnlyList<NavigationItemDto>>
{
    private readonly INavigationTreeRepository _treeRepository;
    private readonly INavigationMenuRepository _menuRepository;

    public GetPublishedMenuQueryHandler(INavigationTreeRepository treeRepository, INavigationMenuRepository menuRepository)
    {
        _treeRepository = treeRepository;
        _menuRepository = menuRepository;
    }

    public async Task<IReadOnlyList<NavigationItemDto>> Handle(GetPublishedMenuQuery request, CancellationToken cancellationToken)
    {
        var tree = await _treeRepository.GetWithMenusAsync(request.TreeId, cancellationToken)
            ?? throw new NavigationTreeNotFoundException(request.TreeId);

        var menu = tree.Menus.FirstOrDefault(m =>
            m.Type.Value.Equals(request.MenuType, StringComparison.OrdinalIgnoreCase) &&
            m.Locale.Equals(request.Locale, StringComparison.OrdinalIgnoreCase));

        if (menu is null || menu.PublishedVersionId is null)
        {
            return Array.Empty<NavigationItemDto>();
        }

        var items = await _menuRepository.GetItemsAsync(menu.Id, menu.PublishedVersionId.Value, cancellationToken);
        return items.Select(NavigationItemDto.From).OrderBy(i => i.Depth).ThenBy(i => i.SortOrder).ToList();
    }
}

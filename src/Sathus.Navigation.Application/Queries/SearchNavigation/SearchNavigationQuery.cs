using System.Linq;
using MediatR;
using Sathus.Navigation.Application.DTOs;
using Sathus.Navigation.Application.Interfaces;
using Sathus.Navigation.Domain.Entities;

namespace Sathus.Navigation.Application.Queries.SearchNavigation;

public sealed record SearchNavigationQuery(
    string? Term = null,
    string? MenuType = null,
    string? Route = null,
    string? Title = null,
    string? Permission = null,
    int Page = 1,
    int PageSize = 50)
    : IRequest<IReadOnlyList<SearchResultDto>>;

public sealed class SearchNavigationQueryHandler : IRequestHandler<SearchNavigationQuery, IReadOnlyList<SearchResultDto>>
{
    private readonly INavigationTreeRepository _treeRepository;
    private readonly INavigationMenuRepository _menuRepository;

    public SearchNavigationQueryHandler(INavigationTreeRepository treeRepository, INavigationMenuRepository menuRepository)
    {
        _treeRepository = treeRepository;
        _menuRepository = menuRepository;
    }

    public async Task<IReadOnlyList<SearchResultDto>> Handle(SearchNavigationQuery request, CancellationToken cancellationToken)
    {
        var trees = await _treeRepository.ListByPlatformAsync(null, cancellationToken);
        var results = new List<SearchResultDto>();
        var term = request.Term?.Trim().ToLowerInvariant();
        var title = request.Title?.Trim().ToLowerInvariant();
        var route = request.Route?.Trim().ToLowerInvariant();
        var permission = request.Permission?.Trim().ToLowerInvariant();

        foreach (var tree in trees)
        {
            foreach (var menu in tree.Menus)
            {
                if (!string.IsNullOrWhiteSpace(request.MenuType) &&
                    !menu.Type.Value.Equals(request.MenuType, StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                var loaded = await _menuRepository.GetWithNodesAsync(menu.Id, cancellationToken);
                if (loaded is null)
                {
                    continue;
                }

                var nodes = Flatten(loaded);
                foreach (var node in nodes)
                {
                    if (term is not null && !node.DisplayName.ToLowerInvariant().Contains(term))
                    {
                        continue;
                    }

                    if (title is not null && !node.DisplayName.ToLowerInvariant().Contains(title))
                    {
                        continue;
                    }

                    if (route is not null && !(node.RoutePath ?? string.Empty).ToLowerInvariant().Contains(route))
                    {
                        continue;
                    }

                    if (permission is not null && !node.Permissions.Any(p => p.Permission.ToLowerInvariant() == permission))
                    {
                        continue;
                    }

                    results.Add(new SearchResultDto(tree.Id, menu.Id, node.Id, node.DisplayName,
                        node.RoutePath, menu.Type.Value, node.ReferenceKind.ToString(), node.ReferenceId));
                }
            }
        }

        return results
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();
    }

    private static List<NavigationNode> Flatten(NavigationMenu menu)
    {
        var list = new List<NavigationNode>();
        var stack = new Stack<NavigationNode>(menu.Nodes);
        while (stack.Count > 0)
        {
            var n = stack.Pop();
            list.Add(n);
            foreach (var c in n.Children) stack.Push(c);
        }

        return list;
    }
}

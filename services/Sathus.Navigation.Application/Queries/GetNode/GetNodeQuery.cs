using MediatR;
using Sathus.Navigation.Application.DTOs;
using Sathus.Navigation.Application.Interfaces;
using Sathus.Navigation.Domain.Exceptions;

namespace Sathus.Navigation.Application.Queries.GetNode;

public sealed record GetNodeQuery(Guid NodeId) : IRequest<NavigationNodeDto>;

public sealed class GetNodeQueryHandler : IRequestHandler<GetNodeQuery, NavigationNodeDto>
{
    private readonly INavigationTreeRepository _treeRepository;
    private readonly INavigationMenuRepository _menuRepository;

    public GetNodeQueryHandler(INavigationTreeRepository treeRepository, INavigationMenuRepository menuRepository)
    {
        _treeRepository = treeRepository;
        _menuRepository = menuRepository;
    }

    public async Task<NavigationNodeDto> Handle(GetNodeQuery request, CancellationToken cancellationToken)
    {
        var trees = await _treeRepository.ListByPlatformAsync(null, cancellationToken);
        foreach (var tree in trees)
        {
            foreach (var menu in tree.Menus)
            {
                var loaded = await _menuRepository.GetWithNodesAsync(menu.Id, cancellationToken);
                var node = loaded?.FindNode(request.NodeId);
                if (node is not null)
                {
                    return NavigationNodeDto.From(node);
                }
            }
        }

        throw new NavigationNodeNotFoundException(request.NodeId);
    }
}

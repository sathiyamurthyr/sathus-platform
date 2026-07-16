using MediatR;
using Sathus.Navigation.Application.DTOs;
using Sathus.Navigation.Application.Interfaces;
using Sathus.Navigation.Domain.Exceptions;

namespace Sathus.Navigation.Application.Commands.MoveNode;

public sealed record MoveNodeCommand(
    Guid MenuId,
    Guid NodeId,
    Guid? NewParentId,
    int NewOrder,
    Guid? ActorId = null)
    : IRequest<NavigationNodeDto>;

public sealed class MoveNodeCommandHandler : IRequestHandler<MoveNodeCommand, NavigationNodeDto>
{
    private readonly INavigationMenuRepository _menuRepository;
    private readonly INavigationTreeRepository _treeRepository;

    public MoveNodeCommandHandler(INavigationMenuRepository menuRepository, INavigationTreeRepository treeRepository)
    {
        _menuRepository = menuRepository;
        _treeRepository = treeRepository;
    }

    public async Task<NavigationNodeDto> Handle(MoveNodeCommand request, CancellationToken cancellationToken)
    {
        var menu = await _menuRepository.GetWithNodesAsync(request.MenuId, cancellationToken)
            ?? throw new NavigationMenuNotFoundException(request.MenuId);

        menu.MoveNode(request.NodeId, request.NewParentId, request.NewOrder);

        var tree = await _treeRepository.GetByIdAsync(menu.TreeId, cancellationToken);
        tree?.RecordHistory(HistoryOperation.Move, menu.Id, request.ActorId,
            $"{{\"nodeId\":\"{request.NodeId}\",\"parent\":\"{request.NewParentId}\",\"order\":{request.NewOrder}}}");

        await _menuRepository.SaveChangesAsync(cancellationToken);
        return NavigationNodeDto.From(menu.FindNode(request.NodeId)!);
    }
}

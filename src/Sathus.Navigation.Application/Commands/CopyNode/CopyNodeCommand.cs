using MediatR;
using Sathus.Navigation.Application.DTOs;
using Sathus.Navigation.Application.Interfaces;
using Sathus.Navigation.Domain.Exceptions;

namespace Sathus.Navigation.Application.Commands.CopyNode;

public sealed record CopyNodeCommand(
    Guid MenuId,
    Guid NodeId,
    Guid? NewParentId,
    Guid? ActorId = null)
    : IRequest<NavigationNodeDto>;

public sealed class CopyNodeCommandHandler : IRequestHandler<CopyNodeCommand, NavigationNodeDto>
{
    private readonly INavigationMenuRepository _menuRepository;
    private readonly INavigationTreeRepository _treeRepository;

    public CopyNodeCommandHandler(INavigationMenuRepository menuRepository, INavigationTreeRepository treeRepository)
    {
        _menuRepository = menuRepository;
        _treeRepository = treeRepository;
    }

    public async Task<NavigationNodeDto> Handle(CopyNodeCommand request, CancellationToken cancellationToken)
    {
        var menu = await _menuRepository.GetWithNodesAsync(request.MenuId, cancellationToken)
            ?? throw new NavigationMenuNotFoundException(request.MenuId);

        var newId = menu.CopyNode(request.NodeId, request.NewParentId);

        var tree = await _treeRepository.GetByIdAsync(menu.TreeId, cancellationToken);
        tree?.RecordHistory(HistoryOperation.Copy, menu.Id, request.ActorId,
            $"{{\"source\":\"{request.NodeId}\",\"copy\":\"{newId}\"}}");

        await _menuRepository.SaveChangesAsync(cancellationToken);
        return NavigationNodeDto.From(menu.FindNode(newId)!);
    }
}

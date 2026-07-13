using MediatR;
using Sathus.Navigation.Application.Interfaces;
using Sathus.Navigation.Domain.Exceptions;

namespace Sathus.Navigation.Application.Commands.DeleteNode;

public sealed record DeleteNodeCommand(Guid MenuId, Guid NodeId, Guid? ActorId = null) : IRequest<Unit>;

public sealed class DeleteNodeCommandHandler : IRequestHandler<DeleteNodeCommand, Unit>
{
    private readonly INavigationMenuRepository _menuRepository;
    private readonly INavigationTreeRepository _treeRepository;

    public DeleteNodeCommandHandler(INavigationMenuRepository menuRepository, INavigationTreeRepository treeRepository)
    {
        _menuRepository = menuRepository;
        _treeRepository = treeRepository;
    }

    public async Task<Unit> Handle(DeleteNodeCommand request, CancellationToken cancellationToken)
    {
        var menu = await _menuRepository.GetWithNodesAsync(request.MenuId, cancellationToken)
            ?? throw new NavigationMenuNotFoundException(request.MenuId);

        menu.DeleteNode(request.NodeId);

        var tree = await _treeRepository.GetByIdAsync(menu.TreeId, cancellationToken);
        tree?.RecordHistory(HistoryOperation.Delete, menu.Id, request.ActorId, $"{{\"nodeId\":\"{request.NodeId}\"}}");

        await _menuRepository.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

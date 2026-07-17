using MediatR;
using Sathus.Navigation.Application.Interfaces;
using Sathus.Navigation.Domain.Exceptions;

namespace Sathus.Navigation.Application.Commands.ArchiveMenu;

public sealed record ArchiveMenuCommand(Guid MenuId, Guid? ActorId = null) : IRequest<Unit>;

public sealed class ArchiveMenuCommandHandler : IRequestHandler<ArchiveMenuCommand, Unit>
{
    private readonly INavigationMenuRepository _menuRepository;
    private readonly INavigationTreeRepository _treeRepository;

    public ArchiveMenuCommandHandler(INavigationMenuRepository menuRepository, INavigationTreeRepository treeRepository)
    {
        _menuRepository = menuRepository;
        _treeRepository = treeRepository;
    }

    public async Task<Unit> Handle(ArchiveMenuCommand request, CancellationToken cancellationToken)
    {
        var menu = await _menuRepository.GetWithNodesAsync(request.MenuId, cancellationToken)
            ?? throw new NavigationMenuNotFoundException(request.MenuId);

        menu.Archive(request.ActorId);

        var tree = await _treeRepository.GetByIdAsync(menu.TreeId, cancellationToken);
        tree?.RecordHistory(HistoryOperation.Archive, menu.Id, request.ActorId);

        await _menuRepository.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

public sealed record RestoreMenuCommand(Guid MenuId, Guid? ActorId = null) : IRequest<Unit>;

public sealed class RestoreMenuCommandHandler : IRequestHandler<RestoreMenuCommand, Unit>
{
    private readonly INavigationMenuRepository _menuRepository;
    private readonly INavigationTreeRepository _treeRepository;

    public RestoreMenuCommandHandler(INavigationMenuRepository menuRepository, INavigationTreeRepository treeRepository)
    {
        _menuRepository = menuRepository;
        _treeRepository = treeRepository;
    }

    public async Task<Unit> Handle(RestoreMenuCommand request, CancellationToken cancellationToken)
    {
        var menu = await _menuRepository.GetWithNodesAsync(request.MenuId, cancellationToken)
            ?? throw new NavigationMenuNotFoundException(request.MenuId);

        menu.Restore(request.ActorId);

        var tree = await _treeRepository.GetByIdAsync(menu.TreeId, cancellationToken);
        tree?.RecordHistory(HistoryOperation.Restore, menu.Id, request.ActorId);

        await _menuRepository.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

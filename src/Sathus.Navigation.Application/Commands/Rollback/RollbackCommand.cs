using MediatR;
using Sathus.Navigation.Application.DTOs;
using Sathus.Navigation.Application.Interfaces;
using Sathus.Navigation.Domain.Exceptions;

namespace Sathus.Navigation.Application.Commands.Rollback;

public sealed record RollbackCommand(Guid MenuId, Guid ToVersionId, Guid? ActorId = null) : IRequest<VersionDto>;

public sealed class RollbackCommandHandler : IRequestHandler<RollbackCommand, VersionDto>
{
    private readonly INavigationMenuRepository _menuRepository;
    private readonly INavigationTreeRepository _treeRepository;

    public RollbackCommandHandler(INavigationMenuRepository menuRepository, INavigationTreeRepository treeRepository)
    {
        _menuRepository = menuRepository;
        _treeRepository = treeRepository;
    }

    public async Task<VersionDto> Handle(RollbackCommand request, CancellationToken cancellationToken)
    {
        var menu = await _menuRepository.GetWithNodesAsync(request.MenuId, cancellationToken)
            ?? throw new NavigationMenuNotFoundException(request.MenuId);

        var target = menu.Rollback(request.ToVersionId, request.ActorId);

        var tree = await _treeRepository.GetByIdAsync(menu.TreeId, cancellationToken);
        tree?.RecordHistory(HistoryOperation.Rollback, menu.Id, request.ActorId,
            $"{{\"version\":\"{request.ToVersionId}\"}}", request.ToVersionId);

        await _menuRepository.SaveChangesAsync(cancellationToken);

        return new VersionDto(target.Id, target.VersionNumber, target.Label, target.Status.ToString(),
            target.CreatedBy, target.CreatedAt, target.PublishedAt, target.ScheduledAt, target.IsCurrent);
    }
}

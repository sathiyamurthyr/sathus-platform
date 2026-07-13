using MediatR;
using Sathus.Navigation.Application.DTOs;
using Sathus.Navigation.Application.Interfaces;
using Sathus.Navigation.Domain.Entities;
using Sathus.Navigation.Domain.Enums;
using Sathus.Navigation.Domain.Exceptions;

namespace Sathus.Navigation.Application.Commands.SetNodePermissions;

public sealed record SetNodePermissionsCommand(
    Guid MenuId,
    Guid NodeId,
    IReadOnlyList<PermissionDto> Permissions,
    Guid? ActorId = null)
    : IRequest<NavigationNodeDto>;

public sealed class SetNodePermissionsCommandHandler : IRequestHandler<SetNodePermissionsCommand, NavigationNodeDto>
{
    private readonly INavigationMenuRepository _menuRepository;
    private readonly INavigationTreeRepository _treeRepository;

    public SetNodePermissionsCommandHandler(INavigationMenuRepository menuRepository, INavigationTreeRepository treeRepository)
    {
        _menuRepository = menuRepository;
        _treeRepository = treeRepository;
    }

    public async Task<NavigationNodeDto> Handle(SetNodePermissionsCommand request, CancellationToken cancellationToken)
    {
        var menu = await _menuRepository.GetWithNodesAsync(request.MenuId, cancellationToken)
            ?? throw new NavigationMenuNotFoundException(request.MenuId);

        var node = menu.FindNode(request.NodeId) ?? throw new NavigationNodeNotFoundException(request.NodeId);

        node.ClearPermissions();
        foreach (var p in request.Permissions)
        {
            node.AddPermission(NavigationPermission.Create(
                p.Permission,
                Enum.TryParse<RequirementMode>(p.Requirement, ignoreCase: true, out var req) ? req : RequirementMode.Any,
                Enum.TryParse<PermissionEffect>(p.Effect, ignoreCase: true, out var eff) ? eff : PermissionEffect.Allow,
                p.Role));
        }

        var tree = await _treeRepository.GetByIdAsync(menu.TreeId, cancellationToken);
        tree?.RecordHistory(HistoryOperation.Permission, menu.Id, request.ActorId, $"{{\"nodeId\":\"{request.NodeId}\"}}");

        await _menuRepository.SaveChangesAsync(cancellationToken);
        return NavigationNodeDto.From(node);
    }
}

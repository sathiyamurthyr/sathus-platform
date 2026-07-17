using MediatR;
using Sathus.Navigation.Application.Common;
using Sathus.Navigation.Application.DTOs;
using Sathus.Navigation.Application.Interfaces;
using Sathus.Navigation.Domain.Enums;
using Sathus.Navigation.Domain.Exceptions;

namespace Sathus.Navigation.Application.Commands.UpdateNode;

public sealed record UpdateNodeCommand(
    Guid MenuId,
    Guid NodeId,
    string DisplayName,
    string ItemType,
    string? RoutePath = null,
    string TargetType = "Internal",
    string? TargetUrl = null,
    string ReferenceKind = "None",
    Guid? ReferenceId = null,
    string? Icon = null,
    string? CssClass = null,
    bool IsExpanded = false,
    bool IsHidden = false,
    bool IsEnabled = true,
    Guid? ActorId = null)
    : IRequest<NavigationNodeDto>;

public sealed class UpdateNodeCommandHandler : IRequestHandler<UpdateNodeCommand, NavigationNodeDto>
{
    private readonly INavigationMenuRepository _menuRepository;
    private readonly INavigationTreeRepository _treeRepository;

    public UpdateNodeCommandHandler(INavigationMenuRepository menuRepository, INavigationTreeRepository treeRepository)
    {
        _menuRepository = menuRepository;
        _treeRepository = treeRepository;
    }

    public async Task<NavigationNodeDto> Handle(UpdateNodeCommand request, CancellationToken cancellationToken)
    {
        var menu = await _menuRepository.GetWithNodesAsync(request.MenuId, cancellationToken)
            ?? throw new NavigationMenuNotFoundException(request.MenuId);

        menu.UpdateNode(
            request.NodeId,
            request.DisplayName,
            Parsers.ParseEnum(request.ItemType, ItemType.Link),
            request.RoutePath,
            Parsers.ParseEnum(request.TargetType, TargetType.Internal),
            request.TargetUrl,
            Parsers.ParseEnum(request.ReferenceKind, ReferenceKind.None),
            request.ReferenceId,
            request.Icon,
            request.CssClass,
            request.IsExpanded,
            request.IsHidden,
            request.IsEnabled,
            request.ActorId);

        var tree = await _treeRepository.GetByIdAsync(menu.TreeId, cancellationToken);
        tree?.RecordHistory(HistoryOperation.Edit, menu.Id, request.ActorId, $"{{\"nodeId\":\"{request.NodeId}\"}}");

        await _menuRepository.SaveChangesAsync(cancellationToken);
        return NavigationNodeDto.From(menu.FindNode(request.NodeId)!);
    }
}

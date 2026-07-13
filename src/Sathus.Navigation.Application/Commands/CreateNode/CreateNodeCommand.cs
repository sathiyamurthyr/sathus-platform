using MediatR;
using Sathus.Navigation.Application.Common;
using Sathus.Navigation.Application.DTOs;
using Sathus.Navigation.Application.Interfaces;
using Sathus.Navigation.Domain.Enums;
using Sathus.Navigation.Domain.Exceptions;

namespace Sathus.Navigation.Application.Commands.CreateNode;

public sealed record CreateNodeCommand(
    Guid MenuId,
    Guid? ParentId,
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

public sealed class CreateNodeCommandHandler : IRequestHandler<CreateNodeCommand, NavigationNodeDto>
{
    private readonly INavigationMenuRepository _menuRepository;
    private readonly INavigationTreeRepository _treeRepository;

    public CreateNodeCommandHandler(INavigationMenuRepository menuRepository, INavigationTreeRepository treeRepository)
    {
        _menuRepository = menuRepository;
        _treeRepository = treeRepository;
    }

    public async Task<NavigationNodeDto> Handle(CreateNodeCommand request, CancellationToken cancellationToken)
    {
        var menu = await _menuRepository.GetWithNodesAsync(request.MenuId, cancellationToken)
            ?? throw new NavigationMenuNotFoundException(request.MenuId);

        var node = menu.CreateNode(
            request.ParentId,
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
        tree?.RecordHistory(HistoryOperation.Create, menu.Id, request.ActorId, $"{{\"nodeId\":\"{node.Id}\"}}");

        await _menuRepository.SaveChangesAsync(cancellationToken);
        return NavigationNodeDto.From(node);
    }
}

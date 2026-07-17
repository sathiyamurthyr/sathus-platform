using MediatR;
using Sathus.Navigation.Application.DTOs;
using Sathus.Navigation.Application.Interfaces;
using Sathus.Navigation.Domain.Entities;
using Sathus.Navigation.Domain.Exceptions;

namespace Sathus.Navigation.Application.Commands.SetNodeLocalization;

public sealed record SetNodeLocalizationCommand(
    Guid MenuId,
    Guid NodeId,
    string LanguageCode,
    string DisplayName,
    string? RoutePath = null,
    bool IsFallback = false,
    Guid? ActorId = null)
    : IRequest<NavigationNodeDto>;

public sealed class SetNodeLocalizationCommandHandler : IRequestHandler<SetNodeLocalizationCommand, NavigationNodeDto>
{
    private readonly INavigationMenuRepository _menuRepository;
    private readonly INavigationTreeRepository _treeRepository;

    public SetNodeLocalizationCommandHandler(INavigationMenuRepository menuRepository, INavigationTreeRepository treeRepository)
    {
        _menuRepository = menuRepository;
        _treeRepository = treeRepository;
    }

    public async Task<NavigationNodeDto> Handle(SetNodeLocalizationCommand request, CancellationToken cancellationToken)
    {
        var menu = await _menuRepository.GetWithNodesAsync(request.MenuId, cancellationToken)
            ?? throw new NavigationMenuNotFoundException(request.MenuId);

        var node = menu.FindNode(request.NodeId) ?? throw new NavigationNodeNotFoundException(request.NodeId);

        node.AddLocalization(NavigationLocalization.Create(request.LanguageCode, request.DisplayName, request.RoutePath, request.IsFallback));

        var tree = await _treeRepository.GetByIdAsync(menu.TreeId, cancellationToken);
        tree?.RecordHistory(HistoryOperation.Localize, menu.Id, request.ActorId,
            $"{{\"nodeId\":\"{request.NodeId}\",\"lang\":\"{request.LanguageCode}\"}}");

        await _menuRepository.SaveChangesAsync(cancellationToken);
        return NavigationNodeDto.From(node);
    }
}

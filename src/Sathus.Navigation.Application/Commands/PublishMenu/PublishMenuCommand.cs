using System.Text.Json;
using MediatR;
using Sathus.Navigation.Application.DTOs;
using Sathus.Navigation.Application.Interfaces;
using Sathus.Navigation.Domain.Entities;
using Sathus.Navigation.Domain.Enums;
using Sathus.Navigation.Domain.Exceptions;

namespace Sathus.Navigation.Application.Commands.PublishMenu;

public sealed record PublishMenuCommand(Guid MenuId, Guid VersionId, Guid? ActorId = null) : IRequest<PublishResultDto>;

public sealed class PublishMenuCommandHandler : IRequestHandler<PublishMenuCommand, PublishResultDto>
{
    private readonly INavigationMenuRepository _menuRepository;
    private readonly INavigationTreeRepository _treeRepository;
    private readonly IReferenceValidator _referenceValidator;

    public PublishMenuCommandHandler(
        INavigationMenuRepository menuRepository,
        INavigationTreeRepository treeRepository,
        IReferenceValidator referenceValidator)
    {
        _menuRepository = menuRepository;
        _treeRepository = treeRepository;
        _referenceValidator = referenceValidator;
    }

    public async Task<PublishResultDto> Handle(PublishMenuCommand request, CancellationToken cancellationToken)
    {
        var menu = await _menuRepository.GetWithNodesAsync(request.MenuId, cancellationToken)
            ?? throw new NavigationMenuNotFoundException(request.MenuId);

        menu.Publish(request.VersionId, request.ActorId);

        await RebuildRoutesAsync(menu, cancellationToken);

        var tree = await _treeRepository.GetByIdAsync(menu.TreeId, cancellationToken);
        tree?.RecordHistory(HistoryOperation.Publish, menu.Id, request.ActorId,
            $"{{\"version\":\"{request.VersionId}\"}}", request.VersionId);

        await _menuRepository.SaveChangesAsync(cancellationToken);

        return new PublishResultDto(menu.Id, request.VersionId, menu.Items.Count, DateTime.UtcNow);
    }

    private async Task RebuildRoutesAsync(NavigationMenu menu, CancellationToken cancellationToken)
    {
        menu.Routes.Clear();
        var nodes = new List<NavigationNode>();
        var stack = new Stack<NavigationNode>(menu.Nodes);
        while (stack.Count > 0)
        {
            var n = stack.Pop();
            nodes.Add(n);
            foreach (var c in n.Children) stack.Push(c);
        }

        foreach (var node in nodes)
        {
            if (string.IsNullOrWhiteSpace(node.RoutePath) && node.ReferenceKind == ReferenceKind.None)
            {
                continue;
            }

            var kind = node.TargetType == TargetType.External ? RouteKind.External
                : node.TargetType == TargetType.Dynamic ? RouteKind.Dynamic : RouteKind.Internal;

            var route = NavigationRoute.Create(
                menu.Id,
                node.RoutePath ?? node.TargetUrl ?? $"/ref/{node.ReferenceKind}/{node.ReferenceId}",
                kind,
                node.TargetUrl,
                node.Id,
                canonicalPath: null,
                node.ReferenceKind,
                node.ReferenceId);

            if (node.ReferenceKind is not (ReferenceKind.None or ReferenceKind.External) && node.ReferenceId is not null)
            {
                var result = await _referenceValidator.ValidateAsync(node.ReferenceKind, node.ReferenceId, cancellationToken);
                if (!result.Exists || result.IsBroken)
                {
                    route.MarkBroken(DateTime.UtcNow);
                }
                else
                {
                    route.MarkResolved(result.ResolvedId, DateTime.UtcNow);
                }
            }

            menu.Routes.Add(route);
        }
    }
}

using MediatR;
using Sathus.Navigation.Application.DTOs;
using Sathus.Navigation.Application.Interfaces;
using Sathus.Navigation.Domain;
using Sathus.Navigation.Domain.Exceptions;

namespace Sathus.Navigation.Application.Commands.CloneMenu;

public sealed record CloneMenuCommand(
    Guid SourceMenuId,
    string? NewName = null,
    string? Locale = null,
    Guid? ActorId = null)
    : IRequest<MenuSummaryDto>;

public sealed class CloneMenuCommandHandler : IRequestHandler<CloneMenuCommand, MenuSummaryDto>
{
    private readonly INavigationTreeRepository _repository;

    public CloneMenuCommandHandler(INavigationTreeRepository repository) => _repository = repository;

    public async Task<MenuSummaryDto> Handle(CloneMenuCommand request, CancellationToken cancellationToken)
    {
        var source = await _repository.GetMenuAsync(request.SourceMenuId, cancellationToken)
            ?? throw new NavigationMenuNotFoundException(request.SourceMenuId);

        var tree = await _repository.GetWithMenusAsync(source.TreeId, cancellationToken)
            ?? throw new NavigationTreeNotFoundException(source.TreeId);

        var clone = NavigationMenu.Create(
            source.TreeId,
            request.NewName ?? $"{source.Name} (copy)",
            MenuType.Create(source.MenuTypeValue),
            request.Locale ?? source.Locale,
            request.ActorId);

        foreach (var root in source.Nodes)
        {
            clone.Nodes.Add(ShallowCopy(root, clone.Id));
        }

        tree.Menus.Add(clone);
        tree.RecordHistory(HistoryOperation.Clone, clone.Id, request.ActorId,
            $"{{\"source\":\"{source.Id}\"}}");

        await _repository.SaveChangesAsync(cancellationToken);

        return new MenuSummaryDto(clone.Id, clone.Name, clone.Type.Value, clone.Locale, clone.Status.ToString(),
            0, clone.PublishedVersionId, clone.ScheduledPublishAt);
    }

    private static Sathus.Navigation.Domain.Entities.NavigationNode ShallowCopy(
        Sathus.Navigation.Domain.Entities.NavigationNode source, Guid menuId)
    {
        var copy = Sathus.Navigation.Domain.Entities.NavigationNode.Create(
            menuId, null, source.SortOrder, source.Depth, source.DisplayName, source.ItemType,
            source.RoutePath, source.TargetType, source.TargetUrl, source.ReferenceKind,
            source.ReferenceId, source.Icon, source.CssClass, source.IsExpanded, source.IsHidden,
            source.IsEnabled, source.CreatedBy);

        foreach (var child in source.Children.OrderBy(c => c.SortOrder))
        {
            var childCopy = ShallowCopy(child, menuId);
            childCopy.Reparent(copy, childCopy.SortOrder, copy.Depth + 1);
            copy.Children.Add(childCopy);
        }

        return copy;
    }
}

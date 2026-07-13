using MediatR;
using Sathus.Navigation.Application.DTOs;
using Sathus.Navigation.Application.Interfaces;
using Sathus.Navigation.Domain;
using Sathus.Navigation.Domain.Exceptions;

namespace Sathus.Navigation.Application.Commands.CreateMenu;

public sealed record CreateMenuCommand(
    Guid TreeId,
    string Name,
    string MenuType,
    string? Locale = null,
    Guid? ActorId = null)
    : IRequest<MenuSummaryDto>;

public sealed class CreateMenuCommandHandler : IRequestHandler<CreateMenuCommand, MenuSummaryDto>
{
    private readonly INavigationTreeRepository _repository;

    public CreateMenuCommandHandler(INavigationTreeRepository repository) => _repository = repository;

    public async Task<MenuSummaryDto> Handle(CreateMenuCommand request, CancellationToken cancellationToken)
    {
        var tree = await _repository.GetWithMenusAsync(request.TreeId, cancellationToken)
            ?? throw new NavigationTreeNotFoundException(request.TreeId);

        var menu = tree.AddMenu(request.Name, Parsers.ParseMenuType(request.MenuType), request.Locale, request.ActorId);
        tree.RecordHistory(HistoryOperation.Create, menu.Id, request.ActorId, payload: $"{{\"menu\":\"{menu.Name}\"}}");

        await _repository.SaveChangesAsync(cancellationToken);

        return new MenuSummaryDto(menu.Id, menu.Name, menu.Type.Value, menu.Locale, menu.Status.ToString(),
            MenuSummaryDtoCount(menu), menu.PublishedVersionId, menu.ScheduledPublishAt);
    }

    private static int MenuSummaryDtoCount(NavigationMenu menu)
    {
        var count = 0;
        var stack = new Stack<NavigationNode>(menu.Nodes);
        while (stack.Count > 0)
        {
            var n = stack.Pop();
            count++;
            foreach (var c in n.Children) stack.Push(c);
        }
        return count;
    }
}

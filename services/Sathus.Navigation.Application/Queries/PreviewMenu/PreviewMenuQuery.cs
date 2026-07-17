using MediatR;
using Sathus.Navigation.Application.DTOs;
using Sathus.Navigation.Application.Interfaces;
using Sathus.Navigation.Domain.Exceptions;

namespace Sathus.Navigation.Application.Queries.PreviewMenu;

public sealed record PreviewMenuQuery(Guid MenuId, Guid VersionId) : IRequest<IReadOnlyList<NavigationItemDto>>;

public sealed class PreviewMenuQueryHandler : IRequestHandler<PreviewMenuQuery, IReadOnlyList<NavigationItemDto>>
{
    private readonly INavigationMenuRepository _repository;

    public PreviewMenuQueryHandler(INavigationMenuRepository repository) => _repository = repository;

    public async Task<IReadOnlyList<NavigationItemDto>> Handle(PreviewMenuQuery request, CancellationToken cancellationToken)
    {
        var menu = await _repository.GetWithNodesAsync(request.MenuId, cancellationToken)
            ?? throw new NavigationMenuNotFoundException(request.MenuId);

        var items = menu.PreviewItems(request.VersionId);
        return items.Select(NavigationItemDto.From).OrderBy(i => i.Depth).ThenBy(i => i.SortOrder).ToList();
    }
}

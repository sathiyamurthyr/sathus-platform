using MediatR;
using Sathus.Navigation.Application.DTOs;
using Sathus.Navigation.Application.Interfaces;
using Sathus.Navigation.Domain.Entities;
using Sathus.Navigation.Domain.Exceptions;

namespace Sathus.Navigation.Application.Queries.GetBrokenRoutes;

public sealed record GetBrokenRoutesQuery(Guid MenuId) : IRequest<IReadOnlyList<BrokenRouteDto>>;

public sealed class GetBrokenRoutesQueryHandler : IRequestHandler<GetBrokenRoutesQuery, IReadOnlyList<BrokenRouteDto>>
{
    private readonly INavigationMenuRepository _menuRepository;

    public GetBrokenRoutesQueryHandler(INavigationMenuRepository menuRepository) => _menuRepository = menuRepository;

    public async Task<IReadOnlyList<BrokenRouteDto>> Handle(GetBrokenRoutesQuery request, CancellationToken cancellationToken)
    {
        var menu = await _menuRepository.GetWithNodesAsync(request.MenuId, cancellationToken)
            ?? throw new NavigationMenuNotFoundException(request.MenuId);

        return menu.Routes
            .Where(r => r.IsBroken)
            .Select(r => new BrokenRouteDto(r.Id, r.MenuId, r.RoutePath, r.TargetUrl,
                r.ReferenceKind.ToString(), r.ResolvedReferenceId))
            .ToList();
    }
}

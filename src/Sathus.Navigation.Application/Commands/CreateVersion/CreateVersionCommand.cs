using MediatR;
using Sathus.Navigation.Application.DTOs;
using Sathus.Navigation.Application.Interfaces;
using Sathus.Navigation.Domain.Exceptions;

namespace Sathus.Navigation.Application.Commands.CreateVersion;

public sealed record CreateVersionCommand(Guid MenuId, string Label, Guid? ActorId = null) : IRequest<VersionDto>;

public sealed class CreateVersionCommandHandler : IRequestHandler<CreateVersionCommand, VersionDto>
{
    private readonly INavigationMenuRepository _menuRepository;
    private readonly INavigationTreeRepository _treeRepository;

    public CreateVersionCommandHandler(INavigationMenuRepository menuRepository, INavigationTreeRepository treeRepository)
    {
        _menuRepository = menuRepository;
        _treeRepository = treeRepository;
    }

    public async Task<VersionDto> Handle(CreateVersionCommand request, CancellationToken cancellationToken)
    {
        var menu = await _menuRepository.GetWithNodesAsync(request.MenuId, cancellationToken)
            ?? throw new NavigationMenuNotFoundException(request.MenuId);

        var version = menu.CreateVersion(request.Label, request.ActorId);

        var tree = await _treeRepository.GetByIdAsync(menu.TreeId, cancellationToken);
        tree?.RecordHistory(HistoryOperation.Version, menu.Id, request.ActorId, $"{{\"version\":{version.VersionNumber}}}", version.Id);

        await _menuRepository.SaveChangesAsync(cancellationToken);

        return new VersionDto(version.Id, version.VersionNumber, version.Label, version.Status.ToString(),
            version.CreatedBy, version.CreatedAt, version.PublishedAt, version.ScheduledAt, version.IsCurrent);
    }
}

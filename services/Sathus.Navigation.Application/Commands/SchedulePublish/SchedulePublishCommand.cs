using MediatR;
using Sathus.Navigation.Application.DTOs;
using Sathus.Navigation.Application.Interfaces;
using Sathus.Navigation.Domain.Exceptions;

namespace Sathus.Navigation.Application.Commands.SchedulePublish;

public sealed record SchedulePublishCommand(
    Guid MenuId,
    Guid VersionId,
    DateTime ScheduledAt,
    Guid? ActorId = null)
    : IRequest<VersionDto>;

public sealed class SchedulePublishCommandHandler : IRequestHandler<SchedulePublishCommand, VersionDto>
{
    private readonly INavigationMenuRepository _menuRepository;
    private readonly INavigationTreeRepository _treeRepository;

    public SchedulePublishCommandHandler(INavigationMenuRepository menuRepository, INavigationTreeRepository treeRepository)
    {
        _menuRepository = menuRepository;
        _treeRepository = treeRepository;
    }

    public async Task<VersionDto> Handle(SchedulePublishCommand request, CancellationToken cancellationToken)
    {
        var menu = await _menuRepository.GetWithNodesAsync(request.MenuId, cancellationToken)
            ?? throw new NavigationMenuNotFoundException(request.MenuId);

        menu.SchedulePublish(request.VersionId, request.ScheduledAt, request.ActorId);

        var tree = await _treeRepository.GetByIdAsync(menu.TreeId, cancellationToken);
        tree?.RecordHistory(HistoryOperation.Schedule, menu.Id, request.ActorId, $"{{\"version\":\"{request.VersionId}\"}}", request.VersionId);

        await _menuRepository.SaveChangesAsync(cancellationToken);

        var version = menu.Versions.First(v => v.Id == request.VersionId);
        return new VersionDto(version.Id, version.VersionNumber, version.Label, version.Status.ToString(),
            version.CreatedBy, version.CreatedAt, version.PublishedAt, version.ScheduledAt, version.IsCurrent);
    }
}

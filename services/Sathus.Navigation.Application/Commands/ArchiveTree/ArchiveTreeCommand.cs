using MediatR;
using Sathus.Navigation.Application.DTOs;
using Sathus.Navigation.Application.Interfaces;
using Sathus.Navigation.Domain.Exceptions;

namespace Sathus.Navigation.Application.Commands.ArchiveTree;

public sealed record ArchiveTreeCommand(Guid TreeId, Guid? ActorId = null) : IRequest<Unit>;

public sealed class ArchiveTreeCommandHandler : IRequestHandler<ArchiveTreeCommand, Unit>
{
    private readonly INavigationTreeRepository _repository;

    public ArchiveTreeCommandHandler(INavigationTreeRepository repository) => _repository = repository;

    public async Task<Unit> Handle(ArchiveTreeCommand request, CancellationToken cancellationToken)
    {
        var tree = await _repository.GetWithMenusAsync(request.TreeId, cancellationToken)
            ?? throw new NavigationTreeNotFoundException(request.TreeId);

        tree.Archive(request.ActorId);
        tree.RecordHistory(HistoryOperation.Archive, actorId: request.ActorId);
        await _repository.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

public sealed record RestoreTreeCommand(Guid TreeId, Guid? ActorId = null) : IRequest<Unit>;

public sealed class RestoreTreeCommandHandler : IRequestHandler<RestoreTreeCommand, Unit>
{
    private readonly INavigationTreeRepository _repository;

    public RestoreTreeCommandHandler(INavigationTreeRepository repository) => _repository = repository;

    public async Task<Unit> Handle(RestoreTreeCommand request, CancellationToken cancellationToken)
    {
        var tree = await _repository.GetWithMenusAsync(request.TreeId, cancellationToken)
            ?? throw new NavigationTreeNotFoundException(request.TreeId);

        tree.Restore(request.ActorId);
        tree.RecordHistory(HistoryOperation.Restore, actorId: request.ActorId);
        await _repository.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

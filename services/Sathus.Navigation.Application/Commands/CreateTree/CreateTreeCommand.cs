using MediatR;
using Sathus.Navigation.Application.DTOs;
using Sathus.Navigation.Application.Interfaces;
using Sathus.Navigation.Domain;
using Sathus.Navigation.Domain.Exceptions;

namespace Sathus.Navigation.Application.Commands.CreateTree;

public sealed record CreateTreeCommand(
    string Platform,
    string Name,
    string DefaultLocale,
    string? Description = null,
    Guid? ActorId = null)
    : IRequest<TreeSummaryDto>;

public sealed class CreateTreeCommandHandler : IRequestHandler<CreateTreeCommand, TreeSummaryDto>
{
    private readonly INavigationTreeRepository _repository;

    public CreateTreeCommandHandler(INavigationTreeRepository repository) => _repository = repository;

    public async Task<TreeSummaryDto> Handle(CreateTreeCommand request, CancellationToken cancellationToken)
    {
        var platform = Parsers.ParsePlatform(request.Platform);
        var tree = NavigationTree.Create(platform, request.Name, request.DefaultLocale, request.Description, request.ActorId);
        tree.RecordHistory(HistoryOperation.Create, actorId: request.ActorId);

        await _repository.AddAsync(tree, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);

        return TreeSummaryDto.From(tree);
    }
}

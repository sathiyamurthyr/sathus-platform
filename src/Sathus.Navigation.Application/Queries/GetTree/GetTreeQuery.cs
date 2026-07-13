using MediatR;
using Sathus.Navigation.Application.DTOs;
using Sathus.Navigation.Application.Interfaces;
using Sathus.Navigation.Domain.Exceptions;

namespace Sathus.Navigation.Application.Queries.GetTree;

public sealed record GetTreeQuery(Guid TreeId) : IRequest<TreeSummaryDto>;

public sealed class GetTreeQueryHandler : IRequestHandler<GetTreeQuery, TreeSummaryDto>
{
    private readonly INavigationTreeRepository _repository;

    public GetTreeQueryHandler(INavigationTreeRepository repository) => _repository = repository;

    public async Task<TreeSummaryDto> Handle(GetTreeQuery request, CancellationToken cancellationToken)
    {
        var tree = await _repository.GetWithMenusAsync(request.TreeId, cancellationToken)
            ?? throw new NavigationTreeNotFoundException(request.TreeId);

        return TreeSummaryDto.From(tree);
    }
}

public sealed record ListTreesQuery(string? Platform = null) : IRequest<IReadOnlyList<TreeSummaryDto>>;

public sealed class ListTreesQueryHandler : IRequestHandler<ListTreesQuery, IReadOnlyList<TreeSummaryDto>>
{
    private readonly INavigationTreeRepository _repository;

    public ListTreesQueryHandler(INavigationTreeRepository repository) => _repository = repository;

    public async Task<IReadOnlyList<TreeSummaryDto>> Handle(ListTreesQuery request, CancellationToken cancellationToken)
    {
        var platform = string.IsNullOrWhiteSpace(request.Platform)
            ? (Platform?)null
            : Parsers.ParsePlatform(request.Platform);

        var trees = await _repository.ListByPlatformAsync(platform, cancellationToken);
        return trees.Select(t => TreeSummaryDto.From(t)).ToList();
    }
}

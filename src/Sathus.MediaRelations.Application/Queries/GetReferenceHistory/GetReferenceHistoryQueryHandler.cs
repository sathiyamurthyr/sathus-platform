using MediatR;
using Sathus.MediaRelations.Application.DTOs;
using Sathus.MediaRelations.Application.Interfaces;

namespace Sathus.MediaRelations.Application.Queries.GetReferenceHistory;

public sealed class GetReferenceHistoryQueryHandler
    : IRequestHandler<GetReferenceHistoryQuery, IReadOnlyList<ReferenceHistoryResponse>>
{
    private readonly IMediaReferenceHistoryRepository _history;

    public GetReferenceHistoryQueryHandler(IMediaReferenceHistoryRepository history)
    {
        _history = history;
    }

    public async Task<IReadOnlyList<ReferenceHistoryResponse>> Handle(GetReferenceHistoryQuery request, CancellationToken cancellationToken)
    {
        var entries = await _history.GetByReferenceIdAsync(request.ReferenceId, cancellationToken);
        return entries.Select(ReferenceHistoryResponse.From).ToList();
    }
}

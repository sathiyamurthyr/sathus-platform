using MediatR;
using Sathus.MediaRelations.Application.DTOs;
using Sathus.MediaRelations.Application.Interfaces;

namespace Sathus.MediaRelations.Application.Queries.EvaluateSafeDelete;

public sealed class EvaluateSafeDeleteQueryHandler : IRequestHandler<EvaluateSafeDeleteQuery, SafeDeleteEvaluation>
{
    private readonly ISafeDeletePolicy _policy;

    public EvaluateSafeDeleteQueryHandler(ISafeDeletePolicy policy)
    {
        _policy = policy;
    }

    public Task<SafeDeleteEvaluation> Handle(EvaluateSafeDeleteQuery request, CancellationToken cancellationToken) =>
        _policy.EvaluateAsync(request.AssetId, request.ForceDelete, cancellationToken);
}

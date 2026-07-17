using MediatR;
using Sathus.MediaRelations.Application.DTOs;

namespace Sathus.MediaRelations.Application.Queries.EvaluateSafeDelete;

/// <summary>Evaluates whether an asset can be safely deleted.</summary>
public sealed record EvaluateSafeDeleteQuery(Guid AssetId, bool ForceDelete = false)
    : IRequest<SafeDeleteEvaluation>;

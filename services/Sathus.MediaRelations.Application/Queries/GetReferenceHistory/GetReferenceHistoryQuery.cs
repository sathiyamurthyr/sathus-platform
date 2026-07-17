using MediatR;
using Sathus.MediaRelations.Application.DTOs;

namespace Sathus.MediaRelations.Application.Queries.GetReferenceHistory;

/// <summary>Returns the full change history for a single reference.</summary>
public sealed record GetReferenceHistoryQuery(Guid ReferenceId) : IRequest<IReadOnlyList<ReferenceHistoryResponse>>;

using Sathus.MediaRelations.Domain.Entities;

namespace Sathus.MediaRelations.Application.DTOs;

public sealed record ReferenceHistoryResponse(
    Guid Id,
    Guid ReferenceId,
    Guid AssetId,
    string Action,
    int Version,
    string StatusAfter,
    string? Detail,
    Guid? ActorId,
    DateTime OccurredAt)
{
    public static ReferenceHistoryResponse From(MediaReferenceHistory history) => new(
        history.Id,
        history.ReferenceId,
        history.AssetId,
        history.Action.ToString(),
        history.Version,
        history.StatusAfter.ToString(),
        history.Detail,
        history.ActorId,
        history.OccurredAt);
}

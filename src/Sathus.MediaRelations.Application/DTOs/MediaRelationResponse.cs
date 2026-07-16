using Sathus.MediaRelations.Domain.Entities;

namespace Sathus.MediaRelations.Application.DTOs;

public sealed record MediaRelationResponse(
    Guid Id,
    string SourceNodeKey,
    string SourceNodeType,
    string TargetNodeKey,
    string TargetNodeType,
    string Relationship,
    DateTime CreatedAt)
{
    public static MediaRelationResponse From(MediaRelation relation) => new(
        relation.Id,
        relation.SourceNodeKey,
        relation.SourceNodeType.ToString(),
        relation.TargetNodeKey,
        relation.TargetNodeType.ToString(),
        relation.Relationship,
        relation.CreatedAt);
}

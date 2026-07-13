using Sathus.MediaRelations.Domain.Entities;

namespace Sathus.MediaRelations.Application.DTOs;

public sealed record MediaReferenceResponse(
    Guid Id,
    Guid AssetId,
    string Module,
    string ReferenceType,
    string SourceReferenceId,
    string UsageType,
    string Path,
    string Scope,
    int Version,
    string Status,
    string? BrokenReason,
    string? Title,
    string? Url,
    DateTime? ScheduledFor,
    DateTime? LastValidatedAt,
    Guid? TenantId,
    DateTime CreatedAt,
    DateTime UpdatedAt)
{
    public static MediaReferenceResponse From(MediaReference reference) => new(
        reference.Id,
        reference.AssetId,
        reference.Module,
        reference.ReferenceType.Value,
        reference.SourceReferenceId.Value,
        reference.UsageType.Value,
        reference.Path.Value,
        reference.Scope.Value,
        reference.Version.Value,
        reference.Status.ToString(),
        reference.BrokenReason,
        reference.Title,
        reference.Url,
        reference.ScheduledFor,
        reference.LastValidatedAt,
        reference.TenantId,
        reference.CreatedAt,
        reference.UpdatedAt);
}

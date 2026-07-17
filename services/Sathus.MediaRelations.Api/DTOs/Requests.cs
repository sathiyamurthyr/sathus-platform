namespace Sathus.MediaRelations.Api.DTOs;

public sealed record CreateReferenceRequest(
    Guid AssetId,
    string Module,
    string ReferenceType,
    string SourceReferenceId,
    string UsageType,
    string? Path = null,
    string? Scope = null,
    string? Title = null,
    string? Url = null,
    DateTime? ScheduledFor = null,
    Guid? TenantId = null);

public sealed record UpdateReferenceRequest(
    Guid? NewAssetId = null,
    string? Title = null,
    string? Url = null,
    string? Path = null,
    string? Scope = null,
    DateTime? ScheduledFor = null);

public sealed record RecordInteractionRequest(long Amount = 1);

using MediatR;
using Sathus.Media.Application.DTOs;

namespace Sathus.Media.Application.Commands.CreateMediaAsset;

public sealed record CreateMediaAssetCommand(
    string FileName,
    string FileExtension,
    string MimeType,
    long Size,
    string Checksum,
    string StorageKey,
    string Type,
    string Language,
    string? AltText = null,
    Guid? FolderId = null,
    Guid? OwnerId = null,
    Guid? TenantId = null,
    string? InitialStatus = "Draft",
    int? Width = null,
    int? Height = null,
    double? DurationSeconds = null,
    string? Hash = null,
    string? Title = null,
    string? Description = null,
    Guid? ActorId = null)
    : IRequest<MediaAssetResponse>;

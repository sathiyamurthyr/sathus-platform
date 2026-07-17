using MediatR;
using Sathus.Processing.Application.DTOs;

namespace Sathus.Processing.Application.Commands.EnqueueAssetProcessing;

public sealed record EnqueueAssetProcessingCommand(
    Guid AssetId,
    string StorageKey,
    string FileName,
    string MimeType,
    string MediaType,
    long FileSize,
    int MaxRetries = 3,
    Guid? ActorId = null,
    Guid? TenantId = null,
    Dictionary<string, string>? Metadata = null)
    : IRequest<EnqueueAssetProcessingResponse>;

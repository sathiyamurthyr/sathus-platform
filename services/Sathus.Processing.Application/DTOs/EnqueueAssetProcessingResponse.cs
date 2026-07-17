namespace Sathus.Processing.Application.DTOs;

public sealed record EnqueueAssetProcessingResponse(Guid JobId, Guid AssetId, string Status);

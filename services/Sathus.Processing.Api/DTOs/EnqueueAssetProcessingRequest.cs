namespace Sathus.Processing.Api.DTOs;

public sealed record EnqueueAssetProcessingRequest(
    Guid AssetId,
    string StorageKey,
    string FileName,
    string MimeType,
    string MediaType,
    long FileSize,
    int MaxRetries = 3,
    Guid? TenantId = null,
    Dictionary<string, string>? Metadata = null);

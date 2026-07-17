namespace Sathus.Upload.Api.DTOs;

public sealed record StartUploadRequest(
    string FileName,
    string FileExtension,
    string MimeType,
    long Size,
    string? Checksum = null,
    long ChunkSize = 5242880,
    Guid? FolderId = null,
    Guid? ParentSessionId = null,
    bool IsFolder = false,
    string? FolderPath = null,
    Dictionary<string, string>? Metadata = null);

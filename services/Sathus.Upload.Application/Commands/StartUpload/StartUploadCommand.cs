using MediatR;
using Sathus.Upload.Application.DTOs;
using Sathus.Upload.Application.Interfaces;
using Sathus.Upload.Domain.Entities;
using Sathus.Upload.Domain.Enums;
using Sathus.Upload.Domain.ValueObjects;

namespace Sathus.Upload.Application.Commands.StartUpload;

public sealed record StartUploadCommand(
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
    Dictionary<string, string>? Metadata = null,
    Guid? ActorId = null)
    : IRequest<UploadSessionResponse>;

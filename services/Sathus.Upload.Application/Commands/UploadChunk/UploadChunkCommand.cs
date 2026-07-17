using MediatR;
using Sathus.Upload.Application.DTOs;
using Sathus.Upload.Application.Interfaces;
using Sathus.Upload.Domain.Entities;
using Sathus.Upload.Domain.Enums;
using Sathus.Upload.Domain.Exceptions;

namespace Sathus.Upload.Application.Commands.UploadChunk;

public sealed record UploadChunkCommand(
    Guid SessionId,
    int ChunkIndex,
    Stream Data,
    string? Checksum = null,
    Guid? ActorId = null)
    : IRequest<UploadChunkResponse>;

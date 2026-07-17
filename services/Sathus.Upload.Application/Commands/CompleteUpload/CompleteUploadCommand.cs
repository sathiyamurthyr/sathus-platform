using MediatR;
using Sathus.Upload.Application.DTOs;
using Sathus.Upload.Application.Interfaces;
using Sathus.Upload.Domain.Entities;
using Sathus.Upload.Domain.Enums;
using Sathus.Upload.Domain.Exceptions;

namespace Sathus.Upload.Application.Commands.CompleteUpload;

public sealed record CompleteUploadCommand(Guid SessionId, Guid? ActorId = null)
    : IRequest<UploadResultResponse>;

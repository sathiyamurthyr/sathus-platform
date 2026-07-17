using MediatR;
using Sathus.Upload.Application.DTOs;
using Sathus.Upload.Application.Interfaces;

namespace Sathus.Upload.Application.Queries.GetUploadSession;

public sealed record GetUploadSessionQuery(Guid Id) : IRequest<UploadSessionResponse>;

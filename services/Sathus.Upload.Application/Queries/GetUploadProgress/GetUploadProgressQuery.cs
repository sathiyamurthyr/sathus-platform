using MediatR;
using Sathus.Upload.Application.DTOs;
using Sathus.Upload.Application.Interfaces;
using Sathus.Upload.Domain.Entities;

namespace Sathus.Upload.Application.Queries.GetUploadProgress;

public sealed record GetUploadProgressQuery(Guid Id) : IRequest<UploadProgressResponse>;

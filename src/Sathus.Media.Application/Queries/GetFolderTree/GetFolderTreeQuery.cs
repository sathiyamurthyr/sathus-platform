using MediatR;
using Sathus.Media.Application.DTOs;

namespace Sathus.Media.Application.Queries.GetFolderTree;

public sealed record GetFolderTreeQuery(Guid? TenantId = null) : IRequest<FolderTreeResponse>;

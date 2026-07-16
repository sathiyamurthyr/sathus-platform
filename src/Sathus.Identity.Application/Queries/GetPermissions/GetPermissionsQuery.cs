using MediatR;
using Sathus.Identity.Application.DTOs;

namespace Sathus.Identity.Application.Queries.GetPermissions;

public sealed record GetPermissionsQuery : IRequest<IReadOnlyList<PermissionResponse>>;

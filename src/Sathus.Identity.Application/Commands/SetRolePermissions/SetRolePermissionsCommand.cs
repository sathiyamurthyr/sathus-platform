using System.Collections.Generic;
using MediatR;

namespace Sathus.Identity.Application.Commands.SetRolePermissions;

public sealed record SetRolePermissionsCommand(Guid RoleId, IReadOnlyList<Guid> PermissionIds)
    : IRequest<Unit>;

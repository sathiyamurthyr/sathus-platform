using System.Collections.Generic;
using MediatR;

namespace Sathus.Identity.Application.Commands.AssignRoles;

public sealed record AssignRolesCommand(Guid UserId, IReadOnlyList<Guid> RoleIds) : IRequest<Unit>;

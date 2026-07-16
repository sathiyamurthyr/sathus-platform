using MediatR;

namespace Sathus.Identity.Application.Commands.DeleteRole;

public sealed record DeleteRoleCommand(Guid RoleId) : IRequest<Unit>;

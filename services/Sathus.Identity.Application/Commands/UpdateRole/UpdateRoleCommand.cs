using MediatR;
using Sathus.Identity.Application.DTOs;

namespace Sathus.Identity.Application.Commands.UpdateRole;

public sealed record UpdateRoleCommand(Guid RoleId, string Name, string? Description = null)
    : IRequest<RoleResponse>;

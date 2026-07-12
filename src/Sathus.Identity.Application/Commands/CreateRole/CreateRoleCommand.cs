using MediatR;
using Sathus.Identity.Application.DTOs;

namespace Sathus.Identity.Application.Commands.CreateRole;

public sealed record CreateRoleCommand(string Name, string? Description = null) : IRequest<RoleResponse>;

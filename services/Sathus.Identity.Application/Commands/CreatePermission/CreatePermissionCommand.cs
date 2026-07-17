using MediatR;
using Sathus.Identity.Application.DTOs;

namespace Sathus.Identity.Application.Commands.CreatePermission;

public sealed record CreatePermissionCommand(string Name, string? Description = null)
    : IRequest<PermissionResponse>;

using MediatR;
using Sathus.Identity.Application.DTOs;

namespace Sathus.Identity.Application.Queries.GetRole;

public sealed record GetRoleQuery(Guid RoleId) : IRequest<RoleDetailResponse>;

using MediatR;
using Sathus.Identity.Application.DTOs;

namespace Sathus.Identity.Application.Queries.GetRoles;

public sealed record GetRolesQuery : IRequest<IReadOnlyList<RoleDetailResponse>>;

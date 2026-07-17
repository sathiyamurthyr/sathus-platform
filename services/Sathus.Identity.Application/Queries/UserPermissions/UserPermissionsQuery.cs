using MediatR;

namespace Sathus.Identity.Application.Queries.UserPermissions;

public sealed record UserPermissionsQuery(Guid UserId) : IRequest<IReadOnlyList<string>>;

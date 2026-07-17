using MediatR;
using Sathus.Identity.Application.DTOs;

namespace Sathus.Identity.Application.Queries.UserSessions;

public sealed record UserSessionsQuery(Guid UserId) : IRequest<IReadOnlyList<SessionResponse>>;

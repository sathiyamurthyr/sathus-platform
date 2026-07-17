using MediatR;
using Sathus.Identity.Application.DTOs;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Domain.Entities;

namespace Sathus.Identity.Application.Queries.UserSessions;

public sealed class UserSessionsQueryHandler : IRequestHandler<UserSessionsQuery, IReadOnlyList<SessionResponse>>
{
    private readonly ISessionService _sessions;

    public UserSessionsQueryHandler(ISessionService sessions)
    {
        _sessions = sessions;
    }

    public async Task<IReadOnlyList<SessionResponse>> Handle(
        UserSessionsQuery request,
        CancellationToken cancellationToken)
    {
        var sessions = await _sessions.GetActiveSessionsAsync(request.UserId, cancellationToken);

        return sessions
            .Select(s => new SessionResponse(
                s.Id,
                s.IpAddress,
                s.UserAgent,
                s.CreatedAt,
                s.ExpiresAt,
                s.IsActive))
            .ToList();
    }
}

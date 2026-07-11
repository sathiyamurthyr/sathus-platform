using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sathus.Identity.Api.Extensions;
using Sathus.Identity.Application.DTOs;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Application.Queries.CurrentUser;

namespace Sathus.Identity.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class CurrentUserController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ISessionService _sessions;

    public CurrentUserController(IMediator mediator, ISessionService sessions)
    {
        _mediator = mediator;
        _sessions = sessions;
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me(CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized(new ErrorResponse("UNAUTHORIZED", "The request is not authenticated."));
        }

        var result = await _mediator.Send(new CurrentUserQuery(userId.Value), cancellationToken);
        return Ok(result);
    }

    [HttpDelete("sessions/{id:guid}")]
    [Authorize]
    public async Task<IActionResult> RevokeSession(Guid id, CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized(new ErrorResponse("UNAUTHORIZED", "The request is not authenticated."));
        }

        await _sessions.RevokeSessionAsync(id, cancellationToken);
        return NoContent();
    }
}

using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sathus.Identity.Api.Extensions;
using Sathus.Identity.Application.DTOs;
using Sathus.Identity.Application.Queries.UserSessions;

namespace Sathus.Identity.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class SessionsController : ControllerBase
{
    private readonly IMediator _mediator;

    public SessionsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("sessions")]
    [Authorize]
    public async Task<IActionResult> GetSessions(CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized(new ErrorResponse("UNAUTHORIZED", "The request is not authenticated."));
        }

        var result = await _mediator.Send(new UserSessionsQuery(userId.Value), cancellationToken);
        return Ok(result);
    }
}

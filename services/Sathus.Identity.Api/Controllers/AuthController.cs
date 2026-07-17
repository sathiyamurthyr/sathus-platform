using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sathus.Identity.Api.Extensions;
using Sathus.Identity.Application.Commands.DisableMfa;
using Sathus.Identity.Application.Commands.EnableMfa;
using Sathus.Identity.Application.Commands.ForgotPassword;
using Sathus.Identity.Application.Commands.Login;
using Sathus.Identity.Application.Commands.Logout;
using Sathus.Identity.Application.Commands.RefreshToken;
using Sathus.Identity.Application.Commands.RegisterUser;
using Sathus.Identity.Application.Commands.ResetPassword;
using Sathus.Identity.Application.Commands.RevokeToken;
using Sathus.Identity.Application.Commands.VerifyEmail;
using Sathus.Identity.Application.DTOs;

namespace Sathus.Identity.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login(
        [FromBody] LoginCommand command,
        CancellationToken cancellationToken)
        => Ok(await _mediator.Send(command, cancellationToken));

    [HttpPost("logout")]
    public async Task<IActionResult> Logout(
        [FromBody] LogoutCommand command,
        CancellationToken cancellationToken)
        => Ok(await _mediator.Send(command, cancellationToken));

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register(
        [FromBody] RegisterUserCommand command,
        CancellationToken cancellationToken)
        => Ok(await _mediator.Send(command, cancellationToken));

    [HttpPost("forgot-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ForgotPassword(
        [FromBody] ForgotPasswordCommand command,
        CancellationToken cancellationToken)
        => Ok(await _mediator.Send(command, cancellationToken));

    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ResetPassword(
        [FromBody] ResetPasswordCommand command,
        CancellationToken cancellationToken)
        => Ok(await _mediator.Send(command, cancellationToken));

    [HttpPost("verify-email")]
    [AllowAnonymous]
    public async Task<IActionResult> VerifyEmail(
        [FromBody] VerifyEmailCommand command,
        CancellationToken cancellationToken)
        => Ok(await _mediator.Send(command, cancellationToken));

    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<IActionResult> Refresh(
        [FromBody] RefreshTokenCommand command,
        CancellationToken cancellationToken)
        => Ok(await _mediator.Send(command, cancellationToken));

    [HttpPost("revoke-token")]
    public async Task<IActionResult> RevokeToken(
        [FromBody] RevokeTokenCommand command,
        CancellationToken cancellationToken)
        => Ok(await _mediator.Send(command, cancellationToken));

    [HttpPost("enable-mfa")]
    public async Task<IActionResult> EnableMfa(
        [FromBody] EnableMfaCommand command,
        CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized(new ErrorResponse("UNAUTHORIZED", "The request is not authenticated."));
        }

        return Ok(await _mediator.Send(command with { UserId = userId.Value }, cancellationToken));
    }

    [HttpPost("disable-mfa")]
    public async Task<IActionResult> DisableMfa(
        [FromBody] DisableMfaCommand command,
        CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized(new ErrorResponse("UNAUTHORIZED", "The request is not authenticated."));
        }

        return Ok(await _mediator.Send(command with { UserId = userId.Value }, cancellationToken));
    }
}

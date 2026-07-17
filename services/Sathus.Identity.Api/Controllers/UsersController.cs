using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sathus.Identity.Api.Extensions;
using Sathus.Identity.Application.Commands.ActivateUser;
using Sathus.Identity.Application.Commands.AssignRoles;
using Sathus.Identity.Application.Commands.CreateUser;
using Sathus.Identity.Application.Commands.DeactivateUser;
using Sathus.Identity.Application.Commands.DeleteUser;
using Sathus.Identity.Application.Commands.ResetUserPassword;
using Sathus.Identity.Application.Commands.UpdateUser;
using Sathus.Identity.Application.DTOs;
using Sathus.Identity.Application.Queries.GetUser;
using Sathus.Identity.Application.Queries.GetUsers;
using Sathus.Identity.Domain;
using Sathus.Identity.Domain.Enums;

namespace Sathus.Identity.Api.Controllers;

[ApiController]
[Route("api/iam/users")]
public sealed class UsersController : ControllerBase
{
    private readonly IMediator _mediator;

    public UsersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [Authorize(Policy = Permissions.UsersRead)]
    public async Task<IActionResult> List(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] UserStatus? status = null,
        CancellationToken cancellationToken = default)
        => Ok(await _mediator.Send(new GetUsersQuery(page, pageSize, search, status), cancellationToken));

    [HttpGet("{id:guid}")]
    [Authorize(Policy = Permissions.UsersRead)]
    public async Task<IActionResult> Get(Guid id, CancellationToken cancellationToken = default)
        => Ok(await _mediator.Send(new GetUserQuery(id), cancellationToken));

    [HttpPost]
    [Authorize(Policy = Permissions.UsersWrite)]
    public async Task<IActionResult> Create([FromBody] CreateUserCommand command, CancellationToken cancellationToken = default)
        => Ok(await _mediator.Send(command, cancellationToken));

    [HttpPut("{id:guid}")]
    [Authorize(Policy = Permissions.UsersWrite)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateUserCommand command, CancellationToken cancellationToken = default)
        => Ok(await _mediator.Send(command with { UserId = id }, cancellationToken));

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = Permissions.UsersManage)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken = default)
    {
        await _mediator.Send(new DeleteUserCommand(id), cancellationToken);
        return NoContent();
    }

    [HttpPost("{id:guid}/activate")]
    [Authorize(Policy = Permissions.UsersManage)]
    public async Task<IActionResult> Activate(Guid id, CancellationToken cancellationToken = default)
    {
        await _mediator.Send(new ActivateUserCommand(id), cancellationToken);
        return NoContent();
    }

    [HttpPost("{id:guid}/deactivate")]
    [Authorize(Policy = Permissions.UsersManage)]
    public async Task<IActionResult> Deactivate(Guid id, CancellationToken cancellationToken = default)
    {
        await _mediator.Send(new DeactivateUserCommand(id), cancellationToken);
        return NoContent();
    }

    [HttpPost("{id:guid}/roles")]
    [Authorize(Policy = Permissions.RolesAssign)]
    public async Task<IActionResult> AssignRoles(Guid id, [FromBody] AssignRolesCommand command, CancellationToken cancellationToken = default)
    {
        await _mediator.Send(command with { UserId = id }, cancellationToken);
        return NoContent();
    }

    [HttpPost("{id:guid}/reset-password")]
    [Authorize(Policy = Permissions.UsersManage)]
    public async Task<IActionResult> ResetPassword(Guid id, [FromBody] ResetUserPasswordCommand command, CancellationToken cancellationToken = default)
    {
        await _mediator.Send(command with { UserId = id }, cancellationToken);
        return NoContent();
    }
}

using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sathus.Identity.Api.Extensions;
using Sathus.Identity.Application.Commands.CreateRole;
using Sathus.Identity.Application.Commands.DeleteRole;
using Sathus.Identity.Application.Commands.SetRolePermissions;
using Sathus.Identity.Application.Commands.UpdateRole;
using Sathus.Identity.Application.DTOs;
using Sathus.Identity.Application.Queries.GetRole;
using Sathus.Identity.Application.Queries.GetRoles;
using Sathus.Identity.Domain;

namespace Sathus.Identity.Api.Controllers;

[ApiController]
[Route("api/iam/roles")]
public sealed class RolesController : ControllerBase
{
    private readonly IMediator _mediator;

    public RolesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [Authorize(Policy = Permissions.RolesRead)]
    public async Task<IActionResult> List(CancellationToken cancellationToken = default)
        => Ok(await _mediator.Send(new GetRolesQuery(), cancellationToken));

    [HttpGet("{id:guid}")]
    [Authorize(Policy = Permissions.RolesRead)]
    public async Task<IActionResult> Get(Guid id, CancellationToken cancellationToken = default)
        => Ok(await _mediator.Send(new GetRoleQuery(id), cancellationToken));

    [HttpPost]
    [Authorize(Policy = Permissions.RolesWrite)]
    public async Task<IActionResult> Create([FromBody] CreateRoleCommand command, CancellationToken cancellationToken = default)
        => Ok(await _mediator.Send(command, cancellationToken));

    [HttpPut("{id:guid}")]
    [Authorize(Policy = Permissions.RolesWrite)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateRoleCommand command, CancellationToken cancellationToken = default)
        => Ok(await _mediator.Send(command with { RoleId = id }, cancellationToken));

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = Permissions.RolesWrite)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken = default)
    {
        await _mediator.Send(new DeleteRoleCommand(id), cancellationToken);
        return NoContent();
    }

    [HttpPut("{id:guid}/permissions")]
    [Authorize(Policy = Permissions.RolesWrite)]
    public async Task<IActionResult> SetPermissions(Guid id, [FromBody] SetRolePermissionsCommand command, CancellationToken cancellationToken = default)
    {
        await _mediator.Send(command with { RoleId = id }, cancellationToken);
        return NoContent();
    }
}

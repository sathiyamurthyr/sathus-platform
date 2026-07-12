using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sathus.Identity.Application.Commands.CreatePermission;
using Sathus.Identity.Application.DTOs;
using Sathus.Identity.Application.Queries.GetPermissions;
using Sathus.Identity.Domain;

namespace Sathus.Identity.Api.Controllers;

[ApiController]
[Route("api/iam/permissions")]
public sealed class PermissionsController : ControllerBase
{
    private readonly IMediator _mediator;

    public PermissionsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [Authorize(Policy = Permissions.PermissionsRead)]
    public async Task<IActionResult> List(CancellationToken cancellationToken = default)
        => Ok(await _mediator.Send(new GetPermissionsQuery(), cancellationToken));

    [HttpPost]
    [Authorize(Policy = Permissions.PermissionsWrite)]
    public async Task<IActionResult> Create([FromBody] CreatePermissionCommand command, CancellationToken cancellationToken = default)
        => Ok(await _mediator.Send(command, cancellationToken));
}

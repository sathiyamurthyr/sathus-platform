using System.Threading;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sathus.Media.Api.Extensions;
using Sathus.Media.Application.Queries.GetFolderTree;
using Sathus.Media.Domain;

namespace Sathus.Media.Api.Controllers;

[ApiController]
[Route("api/v1/media/folders")]
public sealed class MediaFoldersController : ControllerBase
{
    private readonly IMediator _mediator;

    public MediaFoldersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [Authorize(Policy = MediaPermissions.Read)]
    public async Task<IActionResult> Tree([FromQuery] Guid? tenantId, CancellationToken cancellationToken = default) =>
        Ok(await _mediator.Send(new GetFolderTreeQuery(tenantId), cancellationToken));
}

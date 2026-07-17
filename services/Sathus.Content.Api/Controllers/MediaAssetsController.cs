using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sathus.Content.Application.Commands.CreateMediaAsset;
using Sathus.Content.Application.DTOs;
using Sathus.Content.Application.Queries.GetMediaAssets;
using Sathus.Content.Domain;

namespace Sathus.Content.Api.Controllers;

[ApiController]
[Route("api/content/media")]
public sealed class MediaAssetsController : ControllerBase
{
    private readonly IMediator _mediator;

    public MediaAssetsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [Authorize(Policy = Permissions.ContentRead)]
    public async Task<IActionResult> List(CancellationToken cancellationToken = default)
        => Ok(await _mediator.Send(new GetMediaAssetsQuery(), cancellationToken));

    [HttpPost]
    [Authorize(Policy = Permissions.ContentWrite)]
    public async Task<IActionResult> Create([FromBody] CreateMediaAssetCommand command, CancellationToken cancellationToken = default)
        => Ok(await _mediator.Send(command, cancellationToken));
}

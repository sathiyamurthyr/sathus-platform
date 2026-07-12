using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sathus.Content.Application.Commands.CreateTag;
using Sathus.Content.Application.DTOs;
using Sathus.Content.Application.Queries.GetTags;
using Sathus.Content.Domain;

namespace Sathus.Content.Api.Controllers;

[ApiController]
[Route("api/content/tags")]
public sealed class TagsController : ControllerBase
{
    private readonly IMediator _mediator;

    public TagsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> List(CancellationToken cancellationToken = default)
        => Ok(await _mediator.Send(new GetTagsQuery(), cancellationToken));

    [HttpPost]
    [Authorize(Policy = Permissions.ContentWrite)]
    public async Task<IActionResult> Create([FromBody] CreateTagCommand command, CancellationToken cancellationToken = default)
        => Ok(await _mediator.Send(command, cancellationToken));
}

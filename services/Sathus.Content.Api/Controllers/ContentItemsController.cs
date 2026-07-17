using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sathus.Content.Application.Commands.CreateContentItem;
using Sathus.Content.Application.Commands.DeleteContentItem;
using Sathus.Content.Application.Commands.PublishContentItem;
using Sathus.Content.Application.Commands.UnpublishContentItem;
using Sathus.Content.Application.Commands.UpdateContentItem;
using Sathus.Content.Application.DTOs;
using Sathus.Content.Application.Queries.GetContentItem;
using Sathus.Content.Application.Queries.GetContentItemBySlug;
using Sathus.Content.Application.Queries.GetContentItems;
using Sathus.Content.Domain;
using Sathus.Content.Domain.Enums;

namespace Sathus.Content.Api.Controllers;

[ApiController]
[Route("api/content/items")]
public sealed class ContentItemsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ContentItemsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [Authorize(Policy = Permissions.ContentRead)]
    public async Task<IActionResult> List(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] ContentType? contentType = null,
        [FromQuery] ContentStatus? status = null,
        [FromQuery] Guid? categoryId = null,
        [FromQuery] Guid? tagId = null,
        [FromQuery] string? search = null,
        [FromQuery] string? sortBy = "createdAt",
        [FromQuery] bool sortDescending = true,
        CancellationToken cancellationToken = default)
        => Ok(await _mediator.Send(new GetContentItemsQuery(page, pageSize, contentType, status, categoryId, tagId, search, sortBy, sortDescending), cancellationToken));

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> Get(Guid id, CancellationToken cancellationToken = default)
        => Ok(await _mediator.Send(new GetContentItemQuery(id), cancellationToken));

    [HttpGet("slug/{slug}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetBySlug(string slug, CancellationToken cancellationToken = default)
        => Ok(await _mediator.Send(new GetContentItemBySlugQuery(slug), cancellationToken));

    [HttpPost]
    [Authorize(Policy = Permissions.ContentWrite)]
    public async Task<IActionResult> Create([FromBody] CreateContentItemCommand command, CancellationToken cancellationToken = default)
        => Ok(await _mediator.Send(command, cancellationToken));

    [HttpPut("{id:guid}")]
    [Authorize(Policy = Permissions.ContentWrite)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateContentItemCommand command, CancellationToken cancellationToken = default)
        => Ok(await _mediator.Send(command with { ContentItemId = id }, cancellationToken));

    [HttpPost("{id:guid}/publish")]
    [Authorize(Policy = Permissions.ContentWrite)]
    public async Task<IActionResult> Publish(Guid id, CancellationToken cancellationToken = default)
    {
        await _mediator.Send(new PublishContentItemCommand(id), cancellationToken);
        return NoContent();
    }

    [HttpPost("{id:guid}/unpublish")]
    [Authorize(Policy = Permissions.ContentWrite)]
    public async Task<IActionResult> Unpublish(Guid id, CancellationToken cancellationToken = default)
    {
        await _mediator.Send(new UnpublishContentItemCommand(id), cancellationToken);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = Permissions.ContentWrite)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken = default)
    {
        await _mediator.Send(new DeleteContentItemCommand(id), cancellationToken);
        return NoContent();
    }
}

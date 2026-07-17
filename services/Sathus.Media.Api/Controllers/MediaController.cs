using System.Threading;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sathus.Media.Api.Extensions;
using Sathus.Media.Api.Requests;
using Sathus.Media.Application.Commands.ArchiveMedia;
using Sathus.Media.Application.Commands.CreateMediaAsset;
using Sathus.Media.Application.Commands.DeleteMedia;
using Sathus.Media.Application.Commands.RestoreMedia;
using Sathus.Media.Application.Commands.UpdateMediaMetadata;
using Sathus.Media.Application.DTOs;
using Sathus.Media.Application.Queries.GetMedia;
using Sathus.Media.Application.Queries.GetMediaById;
using Sathus.Media.Application.Queries.SearchMedia;
using Sathus.Media.Domain;

namespace Sathus.Media.Api.Controllers;

[ApiController]
[Route("api/v1/media")]
public sealed class MediaController : ControllerBase
{
    private readonly IMediator _mediator;

    public MediaController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [Authorize(Policy = MediaPermissions.Read)]
    public async Task<IActionResult> List(
        [FromQuery] Guid? folderId,
        [FromQuery] string? type,
        [FromQuery] string? status,
        [FromQuery] Guid? tagId,
        [FromQuery] string? term,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 25,
        CancellationToken cancellationToken = default) =>
        Ok(await _mediator.Send(new GetMediaQuery(folderId, type, status, tagId, term, page, pageSize), cancellationToken));

    [HttpGet("{id:guid}")]
    [Authorize(Policy = MediaPermissions.Read)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken = default) =>
        Ok(await _mediator.Send(new GetMediaByIdQuery(id), cancellationToken));

    [HttpPost]
    [Authorize(Policy = MediaPermissions.Create)]
    public async Task<IActionResult> Create([FromBody] CreateMediaAssetRequest request, CancellationToken cancellationToken = default)
    {
        var actorId = User.GetUserId();
        var command = new CreateMediaAssetCommand(
            request.FileName,
            request.FileExtension,
            request.MimeType,
            request.Size,
            request.Checksum,
            request.StorageKey,
            request.Type,
            request.Language,
            request.AltText,
            request.FolderId,
            request.OwnerId ?? actorId,
            request.TenantId,
            request.InitialStatus,
            request.Width,
            request.Height,
            request.DurationSeconds,
            request.Hash,
            request.Title,
            request.Description,
            actorId);

        var result = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Policy = MediaPermissions.Update)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateMediaMetadataRequest request, CancellationToken cancellationToken = default)
    {
        var command = new UpdateMediaMetadataCommand(
            id,
            request.AltText,
            request.Language,
            request.Title,
            request.Description,
            request.FolderId,
            User.GetUserId());

        return Ok(await _mediator.Send(command, cancellationToken));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = MediaPermissions.Delete)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken = default)
    {
        await _mediator.Send(new DeleteMediaCommand(id, User.GetUserId()), cancellationToken);
        return NoContent();
    }

    [HttpGet("search")]
    [Authorize(Policy = MediaPermissions.Read)]
    public async Task<IActionResult> Search(
        [FromQuery] string? term,
        [FromQuery] string[]? types,
        [FromQuery] string[]? tags,
        [FromQuery] Guid? folderId,
        [FromQuery] string? status,
        [FromQuery] string? language,
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to,
        [FromQuery] string? sortBy = "relevance",
        [FromQuery] bool descending = true,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 25,
        CancellationToken cancellationToken = default)
    {
        var query = new SearchMediaQuery(
            term,
            types,
            tags,
            folderId,
            status,
            language,
            from,
            to,
            sortBy ?? "relevance",
            descending,
            page,
            pageSize);

        return Ok(await _mediator.Send(query, cancellationToken));
    }

    [HttpPost("{id:guid}/archive")]
    [Authorize(Policy = MediaPermissions.Archive)]
    public async Task<IActionResult> Archive(Guid id, CancellationToken cancellationToken = default)
    {
        await _mediator.Send(new ArchiveMediaCommand(id, User.GetUserId()), cancellationToken);
        return NoContent();
    }

    [HttpPost("{id:guid}/restore")]
    [Authorize(Policy = MediaPermissions.Restore)]
    public async Task<IActionResult> Restore(Guid id, CancellationToken cancellationToken = default)
    {
        await _mediator.Send(new RestoreMediaCommand(id, User.GetUserId()), cancellationToken);
        return NoContent();
    }
}

using Sathus.MediaRelations.Api.DTOs;
using Sathus.MediaRelations.Api.Extensions;
using Sathus.MediaRelations.Application.Commands.CreateReference;
using Sathus.MediaRelations.Application.Commands.RecordInteraction;
using Sathus.MediaRelations.Application.Commands.RemoveReference;
using Sathus.MediaRelations.Application.Commands.RestoreReference;
using Sathus.MediaRelations.Application.Commands.UpdateReference;
using Sathus.MediaRelations.Application.Queries.GetReferenceHistory;

namespace Sathus.MediaRelations.Api.Controllers;

/// <summary>
/// Write surface of the reference engine: create/update/remove/restore references and
/// record view/download interactions.
/// </summary>
[ApiController]
[Route("api/v1/media/references")]
public sealed class MediaReferencesController : ControllerBase
{
    private readonly IMediator _mediator;

    public MediaReferencesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    [Authorize(Policy = MediaRelationPermissions.UsageManage)]
    public async Task<IActionResult> Create([FromBody] CreateReferenceRequest request, CancellationToken cancellationToken = default)
    {
        var actorId = User.GetUserId();
        var command = new CreateReferenceCommand(
            request.AssetId,
            request.Module,
            request.ReferenceType,
            request.SourceReferenceId,
            request.UsageType,
            request.Path,
            request.Scope,
            request.Title,
            request.Url,
            request.ScheduledFor,
            request.TenantId,
            actorId);

        var result = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetHistory), new { id = result.Id }, result);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Policy = MediaRelationPermissions.UsageManage)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateReferenceRequest request, CancellationToken cancellationToken = default)
    {
        var actorId = User.GetUserId();
        var command = new UpdateReferenceCommand(
            id,
            request.NewAssetId,
            request.Title,
            request.Url,
            request.Path,
            request.Scope,
            request.ScheduledFor,
            actorId);

        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = MediaRelationPermissions.UsageManage)]
    public async Task<IActionResult> Remove(Guid id, CancellationToken cancellationToken = default)
    {
        var actorId = User.GetUserId();
        await _mediator.Send(new RemoveReferenceCommand(id, actorId), cancellationToken);
        return NoContent();
    }

    [HttpPost("{id:guid}/restore")]
    [Authorize(Policy = MediaRelationPermissions.UsageManage)]
    public async Task<IActionResult> Restore(Guid id, CancellationToken cancellationToken = default)
    {
        var actorId = User.GetUserId();
        var result = await _mediator.Send(new RestoreReferenceCommand(id, actorId), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:guid}/history")]
    [Authorize(Policy = MediaRelationPermissions.UsageRead)]
    public async Task<IActionResult> GetHistory(Guid id, CancellationToken cancellationToken = default) =>
        Ok(await _mediator.Send(new GetReferenceHistoryQuery(id), cancellationToken));

    [HttpPost("/api/v1/media/{assetId:guid}/views")]
    [Authorize(Policy = MediaRelationPermissions.UsageManage)]
    public async Task<IActionResult> RecordView(Guid assetId, [FromBody] RecordInteractionRequest? request, CancellationToken cancellationToken = default)
    {
        var actorId = User.GetUserId();
        var result = await _mediator.Send(new RecordAssetViewCommand(assetId, request?.Amount ?? 1, actorId), cancellationToken);
        return Ok(result);
    }

    [HttpPost("/api/v1/media/{assetId:guid}/downloads")]
    [Authorize(Policy = MediaRelationPermissions.UsageManage)]
    public async Task<IActionResult> RecordDownload(Guid assetId, [FromBody] RecordInteractionRequest? request, CancellationToken cancellationToken = default)
    {
        var actorId = User.GetUserId();
        var result = await _mediator.Send(new RecordAssetDownloadCommand(assetId, request?.Amount ?? 1, actorId), cancellationToken);
        return Ok(result);
    }
}

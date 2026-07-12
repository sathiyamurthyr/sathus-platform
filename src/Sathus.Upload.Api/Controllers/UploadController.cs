using MediatR;
using Microsoft.AspNetCore.Mvc;
using Sathus.Media.Domain;
using Sathus.Upload.Api.DTOs;
using Sathus.Upload.Api.Extensions;
using Sathus.Upload.Application.Commands.CancelUpload;
using Sathus.Upload.Application.Commands.CompleteUpload;
using Sathus.Upload.Application.Commands.ResumeUpload;
using Sathus.Upload.Application.Commands.StartUpload;
using Sathus.Upload.Application.Commands.UploadChunk;
using Sathus.Upload.Application.DTOs;
using Sathus.Upload.Application.Queries.GetUploadProgress;
using Sathus.Upload.Application.Queries.GetUploadSession;

namespace Sathus.Upload.Api.Controllers;

[ApiController]
[Route("api/v1/uploads")]
public sealed class UploadController : ControllerBase
{
    private readonly IMediator _mediator;

    public UploadController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("start")]
    [Authorize(Policy = UploadPermissions.Upload)]
    public async Task<IActionResult> Start([FromBody] StartUploadRequest request, CancellationToken cancellationToken = default)
    {
        var actorId = User.GetUserId();
        var command = new StartUploadCommand(
            request.FileName,
            request.FileExtension,
            request.MimeType,
            request.Size,
            request.Checksum,
            request.ChunkSize,
            request.FolderId,
            request.ParentSessionId,
            request.IsFolder,
            request.FolderPath,
            request.Metadata,
            actorId);

        var result = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPost("chunk")]
    [Authorize(Policy = UploadPermissions.Upload)]
    public async Task<IActionResult> UploadChunk([FromForm] UploadChunkRequest request, CancellationToken cancellationToken = default)
    {
        if (request.Data is null || request.Data.Length == 0)
            return BadRequest(new UploadErrorResponse("bad_request", "Chunk data is required."));

        var actorId = User.GetUserId();
        await using var stream = request.Data.OpenReadStream();
        var command = new UploadChunkCommand(
            request.SessionId,
            request.ChunkIndex,
            stream,
            request.Checksum,
            actorId);

        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }

    [HttpPost("complete")]
    [Authorize(Policy = UploadPermissions.Upload)]
    public async Task<IActionResult> Complete([FromBody] CompleteUploadRequest request, CancellationToken cancellationToken = default)
    {
        var actorId = User.GetUserId();
        var command = new CompleteUploadCommand(request.SessionId, actorId);
        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }

    [HttpPost("cancel")]
    [Authorize(Policy = UploadPermissions.Cancel)]
    public async Task<IActionResult> Cancel([FromBody] CancelUploadRequest request, CancellationToken cancellationToken = default)
    {
        var actorId = User.GetUserId();
        var command = new CancelUploadCommand(request.SessionId, actorId);
        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }

    [HttpPost("resume")]
    [Authorize(Policy = UploadPermissions.Upload)]
    public async Task<IActionResult> Resume([FromBody] ResumeUploadRequest request, CancellationToken cancellationToken = default)
    {
        var actorId = User.GetUserId();
        var command = new ResumeUploadCommand(request.SessionId, actorId);
        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [Authorize(Policy = UploadPermissions.Upload)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken = default)
    {
        var query = new GetUploadSessionQuery(id);
        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:guid}/progress")]
    [Authorize(Policy = UploadPermissions.Upload)]
    public async Task<IActionResult> GetProgress(Guid id, CancellationToken cancellationToken = default)
    {
        var query = new GetUploadProgressQuery(id);
        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }
}

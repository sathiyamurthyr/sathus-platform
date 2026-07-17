using MediatR;
using Microsoft.AspNetCore.Mvc;
using Sathus.Processing.Api.DTOs;
using Sathus.Processing.Api.Extensions;
using Sathus.Processing.Application.Commands.EnqueueAssetProcessing;
using Sathus.Processing.Application.Commands.RetryProcessing;
using Sathus.Processing.Application.DTOs;
using Sathus.Processing.Application.Queries.GetProcessingHealth;
using Sathus.Processing.Application.Queries.GetProcessingJob;
using Sathus.Processing.Application.Queries.GetProcessingJobs;
using Sathus.Processing.Application.Queries.GetProcessingStatus;
using Sathus.Processing.Domain;
using Sathus.SharedKernel.Paging;

namespace Sathus.Processing.Api.Controllers;

[ApiController]
[Route("api/v1/processing")]
public sealed class ProcessingController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProcessingController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    [Authorize(Policy = ProcessingPermissions.Manage)]
    public async Task<IActionResult> Enqueue([FromBody] EnqueueAssetProcessingRequest request, CancellationToken cancellationToken = default)
    {
        var actorId = User.GetUserId();
        var command = new EnqueueAssetProcessingCommand(
            request.AssetId,
            request.StorageKey,
            request.FileName,
            request.MimeType,
            request.MediaType,
            request.FileSize,
            request.MaxRetries,
            actorId,
            request.TenantId,
            request.Metadata);

        var result = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetJob), new { jobId = result.JobId }, result);
    }

    [HttpPost("{assetId:guid}/retry")]
    [Authorize(Policy = ProcessingPermissions.Retry)]
    public async Task<IActionResult> Retry(Guid assetId, CancellationToken cancellationToken = default)
    {
        var command = new RetryProcessingCommand(assetId);
        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }

    [HttpGet("health")]
    [Authorize(Policy = ProcessingPermissions.Read)]
    public async Task<IActionResult> Health(CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(new GetProcessingHealthQuery(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("jobs")]
    [Authorize(Policy = ProcessingPermissions.Read)]
    public async Task<IActionResult> GetJobs(
        [FromQuery] string? status = null,
        [FromQuery] string? mediaType = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var query = new GetProcessingJobsQuery(status, mediaType, page, pageSize);
        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    [HttpGet("jobs/{jobId:guid}")]
    [Authorize(Policy = ProcessingPermissions.Read)]
    public async Task<IActionResult> GetJob(Guid jobId, CancellationToken cancellationToken = default)
    {
        var query = new GetProcessingJobQuery(jobId);
        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    [HttpGet("status/{assetId:guid}")]
    [Authorize(Policy = ProcessingPermissions.Read)]
    public async Task<IActionResult> GetStatus(Guid assetId, CancellationToken cancellationToken = default)
    {
        var query = new GetProcessingStatusQuery(assetId);
        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }
}

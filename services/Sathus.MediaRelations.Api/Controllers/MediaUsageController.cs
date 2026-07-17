using Sathus.MediaRelations.Api.Extensions;
using Sathus.MediaRelations.Application.Commands.ValidateReference;
using Sathus.MediaRelations.Application.Queries.EvaluateSafeDelete;
using Sathus.MediaRelations.Application.Queries.GetAssetDependents;
using Sathus.MediaRelations.Application.Queries.GetAssetRelations;
using Sathus.MediaRelations.Application.Queries.GetAssetUsage;
using Sathus.MediaRelations.Application.Queries.GetBrokenReferences;
using Sathus.MediaRelations.Application.Queries.GetOrphans;
using Sathus.MediaRelations.Application.Queries.GetUsageGraph;
using Sathus.MediaRelations.Application.Queries.SearchReferences;

namespace Sathus.MediaRelations.Api.Controllers;

/// <summary>
/// Read + validation surface of the Asset Relationship &amp; Usage Engine. All routes are
/// versioned under <c>/api/v1/media</c> as required by the platform contract.
/// </summary>
[ApiController]
[Route("api/v1/media")]
public sealed class MediaUsageController : ControllerBase
{
    private readonly IMediator _mediator;

    public MediaUsageController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>Aggregated usage report for an asset.</summary>
    [HttpGet("{id:guid}/usage")]
    [Authorize(Policy = MediaRelationPermissions.UsageRead)]
    public async Task<IActionResult> GetUsage(Guid id, CancellationToken cancellationToken = default) =>
        Ok(await _mediator.Send(new GetAssetUsageQuery(id), cancellationToken));

    /// <summary>Direct relation edges originating from an asset.</summary>
    [HttpGet("{id:guid}/relations")]
    [Authorize(Policy = MediaRelationPermissions.UsageRead)]
    public async Task<IActionResult> GetRelations(Guid id, CancellationToken cancellationToken = default) =>
        Ok(await _mediator.Send(new GetAssetRelationsQuery(id), cancellationToken));

    /// <summary>Recursive set of nodes that depend on the asset.</summary>
    [HttpGet("{id:guid}/dependents")]
    [Authorize(Policy = MediaRelationPermissions.UsageRead)]
    public async Task<IActionResult> GetDependents(Guid id, [FromQuery] int maxDepth = 16, CancellationToken cancellationToken = default) =>
        Ok(await _mediator.Send(new GetAssetDependentsQuery(id, maxDepth), cancellationToken));

    /// <summary>The full recursive usage graph rooted at the asset.</summary>
    [HttpGet("{id:guid}/graph")]
    [Authorize(Policy = MediaRelationPermissions.UsageRead)]
    public async Task<IActionResult> GetGraph(Guid id, [FromQuery] int maxDepth = 16, CancellationToken cancellationToken = default) =>
        Ok(await _mediator.Send(new GetUsageGraphQuery(id, maxDepth), cancellationToken));

    /// <summary>Safe-delete evaluation for the asset.</summary>
    [HttpGet("{id:guid}/safe-delete")]
    [Authorize(Policy = MediaRelationPermissions.UsageRead)]
    public async Task<IActionResult> EvaluateSafeDelete(Guid id, [FromQuery] bool force = false, CancellationToken cancellationToken = default) =>
        Ok(await _mediator.Send(new EvaluateSafeDeleteQuery(id, force), cancellationToken));

    /// <summary>Assets that exist but currently have no active references.</summary>
    [HttpGet("orphans")]
    [Authorize(Policy = MediaRelationPermissions.UsageRead)]
    public async Task<IActionResult> GetOrphans([FromQuery] int page = 1, [FromQuery] int pageSize = 50, CancellationToken cancellationToken = default) =>
        Ok(await _mediator.Send(new GetOrphanAssetsQuery(page, pageSize), cancellationToken));

    /// <summary>Broken references awaiting remediation.</summary>
    [HttpGet("broken")]
    [Authorize(Policy = MediaRelationPermissions.UsageRead)]
    public async Task<IActionResult> GetBroken([FromQuery] int page = 1, [FromQuery] int pageSize = 50, CancellationToken cancellationToken = default) =>
        Ok(await _mediator.Send(new GetBrokenReferencesQuery(page, pageSize), cancellationToken));

    /// <summary>Search references by asset, content, reference type, module, relationship, scope or status.</summary>
    [HttpGet("references/search")]
    [Authorize(Policy = MediaRelationPermissions.UsageRead)]
    public async Task<IActionResult> Search(
        [FromQuery] Guid? assetId,
        [FromQuery] string? referenceType,
        [FromQuery] string? module,
        [FromQuery] string? sourceReferenceId,
        [FromQuery] string? usageType,
        [FromQuery] string? scope,
        [FromQuery] string? status,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50,
        CancellationToken cancellationToken = default) =>
        Ok(await _mediator.Send(
            new SearchReferencesQuery(assetId, referenceType, module, sourceReferenceId, usageType, scope, status, page, pageSize),
            cancellationToken));

    /// <summary>Validates an asset's references against the DAM Foundation.</summary>
    [HttpPost("{id:guid}/validate")]
    [Authorize(Policy = MediaRelationPermissions.ReferenceValidate)]
    public async Task<IActionResult> Validate(Guid id, CancellationToken cancellationToken = default)
    {
        var actorId = User.GetUserId();
        var result = await _mediator.Send(new ValidateAssetReferencesCommand(id, actorId), cancellationToken);
        return Ok(result);
    }
}

using System.Threading;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sathus.Navigation.Api.Extensions;
using Sathus.Navigation.Application.Commands.ArchiveMenu;
using Sathus.Navigation.Application.Commands.ArchiveTree;
using Sathus.Navigation.Application.Commands.CreateMenu;
using Sathus.Navigation.Application.Commands.CreateTree;
using Sathus.Navigation.Application.Queries.GetMenu;
using Sathus.Navigation.Application.Queries.GetNode;
using Sathus.Navigation.Application.Queries.GetPublishedMenu;
using Sathus.Navigation.Application.Queries.GetTree;
using Sathus.Navigation.Application.Queries.SearchNavigation;
using Sathus.Navigation.Domain;
using Sathus.Navigation.Infrastructure.Persistence;

namespace Sathus.Navigation.Api.Controllers;

[ApiController]
[Route("api/v1/navigation")]
public sealed class NavigationController : ControllerBase
{
    private readonly IMediator _mediator;

    public NavigationController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    [Authorize(Policy = NavigationPermissions.Read)]
    public async Task<IActionResult> List([FromQuery] Guid? treeId, [FromQuery] string? platform, CancellationToken cancellationToken)
    {
        if (treeId.HasValue)
        {
            var tree = await _mediator.Send(new GetTreeQuery(treeId.Value), cancellationToken);
            return Ok(tree);
        }

        var trees = await _mediator.Send(new ListTreesQuery(platform), cancellationToken);
        return Ok(trees);
    }

    [HttpGet("{id:guid}")]
    [Authorize(Policy = NavigationPermissions.Read)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var tree = await _mediator.Send(new GetTreeQuery(id), cancellationToken);
        return Ok(tree);
    }

    [HttpPost]
    [Authorize(Policy = NavigationPermissions.Create)]
    public async Task<IActionResult> Create([FromBody] CreateTreeRequest request, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new CreateTreeCommand(request.Platform, request.Name, request.DefaultLocale, request.Description, User.GetUserId()), cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Policy = NavigationPermissions.Update)]
    public async Task<IActionResult> RenameTree(Guid id, [FromBody] RenameTreeRequest request, CancellationToken cancellationToken)
    {
        return Ok(new { message = "Renamed" });
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = NavigationPermissions.Delete)]
    public async Task<IActionResult> DeleteTree(Guid id, CancellationToken cancellationToken)
    {
        await _mediator.Send(new ArchiveTreeCommand(id, User.GetUserId()), cancellationToken);
        return NoContent();
    }

    [HttpPost("{id:guid}/publish")]
    [Authorize(Policy = NavigationPermissions.Publish)]
    public async Task<IActionResult> Publish(Guid id, CancellationToken cancellationToken)
    {
        return Ok(new { message = "Publish initiated" });
    }

    [HttpPost("{id:guid}/rollback")]
    [Authorize(Policy = NavigationPermissions.Rollback)]
    public async Task<IActionResult> Rollback(Guid id, [FromBody] RollbackRequest request, CancellationToken cancellationToken)
    {
        return Ok(new { message = "Rollback initiated" });
    }
}

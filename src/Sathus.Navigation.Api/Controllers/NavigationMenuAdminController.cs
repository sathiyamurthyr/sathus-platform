using System.Threading;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sathus.Navigation.Api.Extensions;
using Sathus.Navigation.Application.Commands.AddRedirect;
using Sathus.Navigation.Application.Commands.CreateNode;
using Sathus.Navigation.Application.Commands.DeleteNode;
using Sathus.Navigation.Application.Commands.MoveNode;
using Sathus.Navigation.Application.Commands.PublishMenu;
using Sathus.Navigation.Application.Commands.SetNodeLocalization;
using Sathus.Navigation.Application.Commands.SetNodePermissions;
using Sathus.Navigation.Application.Commands.UpdateNode;
using Sathus.Navigation.Application.DTOs;
using Sathus.Navigation.Application.Queries.GetVersions;
using Sathus.Navigation.Application.Queries.PreviewMenu;
using Sathus.Navigation.Application.Queries.SearchNavigation;
using Sathus.Navigation.Domain;

namespace Sathus.Navigation.Api.Controllers;

[ApiController]
[Route("api/v1/navigation/admin/menus")]
public sealed class NavigationMenuAdminController : ControllerBase
{
    private readonly IMediator _mediator;

    public NavigationMenuAdminController(IMediator mediator) => _mediator = mediator;

    [HttpPost]
    [Authorize(Policy = NavigationPermissions.Create)]
    public async Task<IActionResult> CreateMenu([FromBody] CreateMenuRequest request, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new CreateMenuCommand(request.TreeId, request.Name, request.MenuType, request.Locale, User.GetUserId()), cancellationToken);
        return CreatedAtAction(nameof(GetVersions), new { menuId = result.Id }, result);
    }

    [HttpGet("{menuId:guid}")]
    [Authorize(Policy = NavigationPermissions.Read)]
    public async Task<IActionResult> GetMenu(Guid menuId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetMenuQuery(menuId), cancellationToken);
        return Ok(result);
    }

    [HttpPost("{menuId:guid}/archive")]
    [Authorize(Policy = NavigationPermissions.Publish)]
    public async Task<IActionResult> ArchiveMenu(Guid menuId, CancellationToken cancellationToken)
    {
        await _mediator.Send(new ArchiveMenuCommand(menuId, User.GetUserId()), cancellationToken);
        return NoContent();
    }

    [HttpPost("{menuId:guid}/restore")]
    [Authorize(Policy = NavigationPermissions.Publish)]
    public async Task<IActionResult> RestoreMenu(Guid menuId, CancellationToken cancellationToken)
    {
        await _mediator.Send(new RestoreMenuCommand(menuId, User.GetUserId()), cancellationToken);
        return NoContent();
    }

    [HttpPost("{menuId:guid}/clone")]
    [Authorize(Policy = NavigationPermissions.Create)]
    public async Task<IActionResult> CloneMenu(Guid menuId, [FromBody] CloneMenuRequest request, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new CloneMenuCommand(menuId, request.NewName, request.Locale, User.GetUserId()), cancellationToken);
        return Ok(result);
    }

    [HttpPost("{menuId:guid}/nodes")]
    [Authorize(Policy = NavigationPermissions.Create)]
    public async Task<IActionResult> CreateNode(Guid menuId, [FromBody] CreateNodeRequest request, CancellationToken cancellationToken)
    {
        var cmd = new CreateNodeCommand(menuId, request.ParentId, request.DisplayName, request.ItemType,
            request.RoutePath, request.TargetType, request.TargetUrl, request.ReferenceKind, request.ReferenceId,
            request.Icon, request.CssClass, request.IsExpanded, request.IsHidden, request.IsEnabled, User.GetUserId());
        var result = await _mediator.Send(cmd, cancellationToken);
        return Ok(result);
    }

    [HttpPut("{menuId:guid}/nodes/{nodeId:guid}")]
    [Authorize(Policy = NavigationPermissions.Update)]
    public async Task<IActionResult> UpdateNode(Guid menuId, Guid nodeId, [FromBody] UpdateNodeRequest request, CancellationToken cancellationToken)
    {
        var cmd = new UpdateNodeCommand(menuId, nodeId, request.DisplayName, request.ItemType,
            request.RoutePath, request.TargetType, request.TargetUrl, request.ReferenceKind,
            request.ReferenceId, request.Icon, request.CssClass, request.IsExpanded, request.IsHidden, request.IsEnabled, User.GetUserId());
        var result = await _mediator.Send(cmd, cancellationToken);
        return Ok(result);
    }

    [HttpDelete("{menuId:guid}/nodes/{nodeId:guid}")]
    [Authorize(Policy = NavigationPermissions.Delete)]
    public async Task<IActionResult> DeleteNode(Guid menuId, Guid nodeId, CancellationToken cancellationToken)
    {
        await _mediator.Send(new DeleteNodeCommand(menuId, nodeId, User.GetUserId()), cancellationToken);
        return NoContent();
    }

    [HttpPost("{menuId:guid}/nodes/{nodeId:guid}/move")]
    [Authorize(Policy = NavigationPermissions.Update)]
    public async Task<IActionResult> MoveNode(Guid menuId, Guid nodeId, [FromBody] MoveNodeRequest request, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new MoveNodeCommand(menuId, nodeId, request.NewParentId, request.NewOrder, User.GetUserId()), cancellationToken);
        return Ok(result);
    }

    [HttpPost("{menuId:guid}/nodes/{nodeId:guid}/copy")]
    [Authorize(Policy = NavigationPermissions.Create)]
    public async Task<IActionResult> CopyNode(Guid menuId, Guid nodeId, [FromBody] CopyNodeRequest request, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new CopyNodeCommand(menuId, nodeId, request.NewParentId, User.GetUserId()), cancellationToken);
        return Ok(result);
    }

    [HttpPost("{menuId:guid}/nodes/{nodeId:guid}/localization")]
    [Authorize(Policy = NavigationPermissions.Update)]
    public async Task<IActionResult> SetNodeLocalization(Guid menuId, Guid nodeId, [FromBody] SetLocalizationRequest request, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new SetNodeLocalizationCommand(menuId, nodeId, request.LanguageCode, request.DisplayName, request.RoutePath, request.IsFallback, User.GetUserId()), cancellationToken);
        return Ok(result);
    }

    [HttpPost("{menuId:guid}/nodes/{nodeId:guid}/permissions")]
    [Authorize(Policy = NavigationPermissions.Update)]
    public async Task<IActionResult> SetNodePermissions(Guid menuId, Guid nodeId, [FromBody] SetPermissionsRequest request, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new SetNodePermissionsCommand(menuId, nodeId, request.Permissions, User.GetUserId()), cancellationToken);
        return Ok(result);
    }

    [HttpPost("{menuId:guid}/versions")]
    [Authorize(Policy = NavigationPermissions.Update)]
    public async Task<IActionResult> CreateVersion(Guid menuId, [FromBody] CreateVersionRequest request, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new CreateVersionCommand(menuId, request.Label, User.GetUserId()), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{menuId:guid}/versions")]
    [Authorize(Policy = NavigationPermissions.Read)]
    public async Task<IActionResult> GetVersions(Guid menuId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetVersionsQuery(menuId), cancellationToken);
        return Ok(result);
    }

    [HttpPost("{menuId:guid}/versions/{versionId:guid}/publish")]
    [Authorize(Policy = NavigationPermissions.Publish)]
    public async Task<IActionResult> PublishMenu(Guid menuId, Guid versionId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new PublishMenuCommand(menuId, versionId, User.GetUserId()), cancellationToken);
        return Ok(result);
    }

    [HttpPost("{menuId:guid}/versions/{versionId:guid}/schedule")]
    [Authorize(Policy = NavigationPermissions.Publish)]
    public async Task<IActionResult> SchedulePublish(Guid menuId, Guid versionId, [FromBody] SchedulePublishRequest request, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new SchedulePublishCommand(menuId, versionId, request.ScheduledAt, User.GetUserId()), cancellationToken);
        return Ok(result);
    }

    [HttpPost("{menuId:guid}/versions/{versionId:guid}/preview")]
    [Authorize(Policy = NavigationPermissions.Read)]
    public async Task<IActionResult> PreviewMenu(Guid menuId, Guid versionId, CancellationToken cancellationToken)
    {
        var items = await _mediator.Send(new PreviewMenuQuery(menuId, versionId), cancellationToken);
        return Ok(items);
    }

    [HttpPost("{menuId:guid}/rollback")]
    [Authorize(Policy = NavigationPermissions.Rollback)]
    public async Task<IActionResult> Rollback(Guid menuId, [FromBody] RollbackMenuRequest request, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new Sathus.Navigation.Application.Commands.Rollback.RollbackCommand(menuId, request.VersionId, User.GetUserId()), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{menuId:guid}/published/{menuType?}/{locale?}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPublished(Guid menuId, string? menuType, string? locale, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(menuType) || string.IsNullOrWhiteSpace(locale))
        {
            return BadRequest(new { message = "menuType and locale are required." });
        }

        var items = await _mediator.Send(new GetPublishedMenuQuery(menuId, menuType, locale), cancellationToken);
        return Ok(items);
    }
}

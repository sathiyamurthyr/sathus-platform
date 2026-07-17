using System.Threading;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sathus.Search.Api.Extensions;
using Sathus.Search.Application.Commands.DeleteDocument;
using Sathus.Search.Application.Commands.IndexDocument;
using Sathus.Search.Application.Commands.RebuildIndex;
using Sathus.Search.Application.DTOs;
using Sathus.Search.Application.Queries.GetStatus;
using Sathus.Search.Application.Queries.Search;
using Sathus.Search.Application.Queries.Suggest;
using Sathus.Search.Domain;
using Sathus.Search.Domain.Enums;
using Sathus.Search.Domain.ValueObjects;

namespace Sathus.Search.Api.Controllers;

[ApiController]
[Route("api/v1/search")]
public sealed class SearchController : ControllerBase
{
    private readonly IMediator _mediator;

    public SearchController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> Search(
        [FromQuery] string q,
        [FromQuery] Guid? indexId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? sort = null,
        [FromQuery] bool includeFacets = true,
        [FromQuery] bool includeHighlights = true,
        [FromQuery] bool includeSuggestions = true,
        [FromQuery] bool fuzzy = true,
        [FromQuery] string? userId = null,
        [FromQuery] string? userRoles = null,
        CancellationToken cancellationToken = default)
    {
        var query = new SearchQuery(
            q ?? string.Empty,
            indexId,
            Filters: null,
            Sort: ParseSort(sort),
            Pagination: SearchPagination.Create(page < 1 ? 1 : page, pageSize is < 1 or > 100 ? 20 : pageSize),
            IncludeFacets: includeFacets,
            IncludeHighlights: includeHighlights,
            IncludeSuggestions: includeSuggestions,
            Fuzzy: fuzzy,
            UserId: userId,
            UserRoles: userRoles);

        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    [HttpGet("suggest")]
    [AllowAnonymous]
    public async Task<IActionResult> Suggest(
        [FromQuery] string q,
        [FromQuery] Guid? indexId,
        [FromQuery] string? documentType = null,
        [FromQuery] int limit = 8,
        CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(new SuggestQuery(q ?? string.Empty, indexId, documentType, limit), cancellationToken);
        return Ok(result);
    }

    [HttpPost("index")]
    [Authorize(Policy = SearchPermissions.Manage)]
    public async Task<IActionResult> IndexDocument([FromBody] IndexDocumentRequest request, CancellationToken cancellationToken)
    {
        var command = new IndexDocumentCommand(
            request.IndexId,
            request.ExternalId,
            Enum.Parse<IndexSourceType>(request.SourceType, ignoreCase: true),
            request.Title,
            request.Content,
            request.Url,
            request.ImageUrl,
            request.AuthorId,
            request.AuthorName,
            request.Language,
            request.Metadata,
            request.IsFeatured,
            request.PublishedAt,
            request.ExpiresAt,
            Enum.Parse<PermissionScope>(request.PermissionScope, ignoreCase: true),
            request.RequiredRoles,
            request.AllowedUsers,
            User.GetUserId());

        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }

    [HttpPost("rebuild")]
    [Authorize(Policy = SearchPermissions.Reindex)]
    public async Task<IActionResult> Rebuild([FromBody] RebuildIndexRequest request, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new RebuildIndexCommand(request.IndexId, User.GetUserId()), cancellationToken);
        return Ok(result);
    }

    [HttpGet("status")]
    [Authorize(Policy = SearchPermissions.Read)]
    public async Task<IActionResult> Status([FromQuery] Guid? indexId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetIndexStatusQuery(indexId), cancellationToken);
        return Ok(result);
    }

    [HttpDelete("documents/{id:guid}")]
    [Authorize(Policy = SearchPermissions.Manage)]
    public async Task<IActionResult> DeleteDocument(Guid id, CancellationToken cancellationToken)
    {
        await _mediator.Send(new DeleteDocumentCommand(id, User.GetUserId()), cancellationToken);
        return NoContent();
    }

    private static IReadOnlyList<SearchSort>? ParseSort(string? sort)
    {
        if (string.IsNullOrWhiteSpace(sort))
        {
            return null;
        }

        var sorts = new List<SearchSort>();
        foreach (var part in sort.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
        {
            var segments = part.Split(':', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
            var field = segments[0];
            var direction = segments.Length > 1 && segments[1].Equals("desc", StringComparison.OrdinalIgnoreCase)
                ? SortDirection.Desc
                : SortDirection.Asc;
            sorts.Add(SearchSort.Create(field, direction));
        }

        return sorts.Count == 0 ? null : sorts;
    }
}

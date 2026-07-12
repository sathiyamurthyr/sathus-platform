using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sathus.Content.Application.Commands.CreateCategory;
using Sathus.Content.Application.Commands.DeleteCategory;
using Sathus.Content.Application.Commands.UpdateCategory;
using Sathus.Content.Application.DTOs;
using Sathus.Content.Application.Queries.GetCategories;
using Sathus.Content.Domain;

namespace Sathus.Content.Api.Controllers;

[ApiController]
[Route("api/content/categories")]
public sealed class CategoriesController : ControllerBase
{
    private readonly IMediator _mediator;

    public CategoriesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [Authorize(Policy = Permissions.ContentRead)]
    public async Task<IActionResult> List(CancellationToken cancellationToken = default)
        => Ok(await _mediator.Send(new GetCategoriesQuery(), cancellationToken));

    [HttpPost]
    [Authorize(Policy = Permissions.ContentWrite)]
    public async Task<IActionResult> Create([FromBody] CreateCategoryCommand command, CancellationToken cancellationToken = default)
        => Ok(await _mediator.Send(command, cancellationToken));

    [HttpPut("{id:guid}")]
    [Authorize(Policy = Permissions.ContentWrite)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCategoryCommand command, CancellationToken cancellationToken = default)
        => Ok(await _mediator.Send(command with { CategoryId = id }, cancellationToken));

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = Permissions.ContentWrite)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken = default)
    {
        await _mediator.Send(new DeleteCategoryCommand(id), cancellationToken);
        return NoContent();
    }
}

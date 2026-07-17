using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sathus.Storage.Application.DTOs;
using Sathus.Storage.Application.Queries.GetConfig;
using Sathus.Storage.Application.Queries.GetHealth;
using Sathus.Storage.Application.Queries.GetProviders;
using Sathus.Storage.Domain;

namespace Sathus.Storage.Api.Controllers;

[ApiController]
[Route("api/v1/storage")]
public sealed class StorageController : ControllerBase
{
    private readonly IMediator _mediator;

    public StorageController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("providers")]
    [Authorize(Policy = Permissions.StorageProviders)]
    public async Task<ActionResult<IReadOnlyList<ProviderResponse>>> GetProviders(CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(new GetProvidersQuery(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("health")]
    [Authorize(Policy = Permissions.StorageHealth)]
    public async Task<ActionResult<IReadOnlyList<HealthResponse>>> GetHealth(CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(new GetHealthQuery(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("config")]
    [Authorize(Policy = Permissions.StorageConfigure)]
    public async Task<ActionResult<ConfigResponse>> GetConfig(CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(new GetConfigQuery(), cancellationToken);
        return Ok(result);
    }
}

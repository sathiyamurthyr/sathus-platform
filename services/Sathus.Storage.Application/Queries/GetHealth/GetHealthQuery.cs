using MediatR;
using Sathus.Storage.Application.DTOs;

namespace Sathus.Storage.Application.Queries.GetHealth;

public sealed record GetHealthQuery() : IRequest<IReadOnlyList<HealthResponse>>;

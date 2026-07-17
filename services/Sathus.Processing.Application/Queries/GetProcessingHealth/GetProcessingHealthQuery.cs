using MediatR;
using Sathus.Processing.Application.DTOs;

namespace Sathus.Processing.Application.Queries.GetProcessingHealth;

public sealed record GetProcessingHealthQuery()
    : IRequest<ProcessingHealthResponse>;

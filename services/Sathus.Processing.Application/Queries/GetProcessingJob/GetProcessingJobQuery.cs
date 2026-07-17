using MediatR;
using Sathus.Processing.Application.DTOs;

namespace Sathus.Processing.Application.Queries.GetProcessingJob;

public sealed record GetProcessingJobQuery(Guid JobId)
    : IRequest<AssetProcessingJobResponse>;

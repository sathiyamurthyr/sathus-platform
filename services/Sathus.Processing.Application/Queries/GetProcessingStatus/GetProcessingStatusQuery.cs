using MediatR;
using Sathus.Processing.Application.DTOs;

namespace Sathus.Processing.Application.Queries.GetProcessingStatus;

public sealed record GetProcessingStatusQuery(Guid AssetId)
    : IRequest<AssetProcessingStatusResponse>;

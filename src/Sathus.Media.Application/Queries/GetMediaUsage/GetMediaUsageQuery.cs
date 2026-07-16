using MediatR;
using Sathus.Media.Application.DTOs;

namespace Sathus.Media.Application.Queries.GetMediaUsage;

public sealed record GetMediaUsageQuery(Guid AssetId) : IRequest<IReadOnlyList<MediaUsageResponse>>;

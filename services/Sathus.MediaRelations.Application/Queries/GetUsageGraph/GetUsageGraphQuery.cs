using MediatR;
using Sathus.MediaRelations.Application.DTOs;

namespace Sathus.MediaRelations.Application.Queries.GetUsageGraph;

/// <summary>Returns the recursive usage graph rooted at an asset.</summary>
public sealed record GetUsageGraphQuery(Guid AssetId, int MaxDepth = 16) : IRequest<UsageGraphResponse>;

using MediatR;
using Sathus.MediaRelations.Application.DTOs;

namespace Sathus.MediaRelations.Application.Queries.GetAssetUsage;

/// <summary>Returns the aggregated usage report for an asset (references + statistics).</summary>
public sealed record GetAssetUsageQuery(Guid AssetId) : IRequest<AssetUsageResponse>;

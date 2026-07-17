using MediatR;
using Sathus.MediaRelations.Application.DTOs;

namespace Sathus.MediaRelations.Application.Commands.RecordInteraction;

/// <summary>Records asset view interactions for statistics.</summary>
public sealed record RecordAssetViewCommand(Guid AssetId, long Amount = 1, Guid? ActorId = null)
    : IRequest<UsageStatisticsResponse>;

/// <summary>Records asset download interactions for statistics.</summary>
public sealed record RecordAssetDownloadCommand(Guid AssetId, long Amount = 1, Guid? ActorId = null)
    : IRequest<UsageStatisticsResponse>;

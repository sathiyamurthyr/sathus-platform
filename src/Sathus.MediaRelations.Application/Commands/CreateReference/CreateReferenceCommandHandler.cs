using MediatR;
using Sathus.MediaRelations.Application.DTOs;
using Sathus.MediaRelations.Application.Interfaces;
using Sathus.MediaRelations.Domain.Entities;
using Sathus.MediaRelations.Domain.Enums;
using Sathus.MediaRelations.Domain.Exceptions;
using Sathus.MediaRelations.Domain.ValueObjects;

namespace Sathus.MediaRelations.Application.Commands.CreateReference;

public sealed class CreateReferenceCommandHandler : IRequestHandler<CreateReferenceCommand, MediaReferenceResponse>
{
    private readonly IMediaReferenceRepository _references;
    private readonly IMediaUsageRepository _usages;
    private readonly IMediaUsageStatisticsRepository _statistics;
    private readonly IMediaRelationRepository _relations;
    private readonly IMediaReferenceHistoryRepository _history;
    private readonly IUsageGraphCache _graphCache;

    public CreateReferenceCommandHandler(
        IMediaReferenceRepository references,
        IMediaUsageRepository usages,
        IMediaUsageStatisticsRepository statistics,
        IMediaRelationRepository relations,
        IMediaReferenceHistoryRepository history,
        IUsageGraphCache graphCache)
    {
        _references = references;
        _usages = usages;
        _statistics = statistics;
        _relations = relations;
        _history = history;
        _graphCache = graphCache;
    }

    public async Task<MediaReferenceResponse> Handle(CreateReferenceCommand request, CancellationToken cancellationToken)
    {
        var referenceType = ReferenceType.Create(request.ReferenceType);
        var sourceReferenceId = ReferenceId.Create(request.SourceReferenceId);
        var usageType = UsageType.Create(request.UsageType);
        var path = ReferencePath.Create(request.Path);
        var scope = request.Scope is null ? ReferenceScope.Draft : ReferenceScope.Create(request.Scope);

        var reference = new MediaReference(
            assetId: request.AssetId,
            module: request.Module,
            referenceType: referenceType,
            sourceReferenceId: sourceReferenceId,
            usageType: usageType,
            path: path,
            scope: scope,
            tenantId: request.TenantId,
            title: request.Title,
            url: request.Url,
            scheduledFor: request.ScheduledFor,
            createdBy: request.ActorId);

        var existing = await _references.GetByDeduplicationKeyAsync(reference.DeduplicationKey, cancellationToken);
        if (existing is not null && existing.Status != ReferenceStatus.Removed)
        {
            throw new DuplicateReferenceException(
                reference.AssetId, referenceType.Value, sourceReferenceId.Value, usageType.Value, path.Value);
        }

        if (existing is not null)
        {
            // Reactivate a previously removed identical reference instead of creating a duplicate row.
            existing.Restore(request.ActorId);
            await _references.UpdateAsync(existing, cancellationToken);
            await _history.AddAsync(
                MediaReferenceHistory.FromReference(existing, ReferenceHistoryAction.Restored, "Recreated from removed reference.", request.ActorId),
                cancellationToken);
            await UpdateProjectionsForAddAsync(existing, usageType, request, cancellationToken);
            await _references.SaveChangesAsync(cancellationToken);
            await _graphCache.InvalidateAsync(existing.AssetId, cancellationToken);
            return MediaReferenceResponse.From(existing);
        }

        await _references.AddAsync(reference, cancellationToken);
        await _history.AddAsync(
            MediaReferenceHistory.FromReference(reference, ReferenceHistoryAction.Created, $"{referenceType.Value}:{sourceReferenceId.Value}", request.ActorId),
            cancellationToken);

        await UpdateProjectionsForAddAsync(reference, usageType, request, cancellationToken);

        await _references.SaveChangesAsync(cancellationToken);
        await _graphCache.InvalidateAsync(reference.AssetId, cancellationToken);

        return MediaReferenceResponse.From(reference);
    }

    private async Task UpdateProjectionsForAddAsync(
        MediaReference reference,
        UsageType usageType,
        CreateReferenceCommand request,
        CancellationToken cancellationToken)
    {
        // Usage edge (per asset ↔ content item).
        var usageKey = $"{reference.AssetId:N}|{reference.Module.ToLowerInvariant()}|{reference.ReferenceType.Value}|{reference.SourceReferenceId.Value}";
        var usage = await _usages.GetByKeyAsync(usageKey, cancellationToken);
        if (usage is null)
        {
            usage = new MediaUsage(reference.AssetId, reference.Module, reference.ReferenceType, reference.SourceReferenceId, request.TenantId, request.ActorId);
            usage.RecordReference(usageType, request.ActorId);
            await _usages.AddAsync(usage, cancellationToken);
        }
        else
        {
            usage.RecordReference(usageType, request.ActorId);
            await _usages.UpdateAsync(usage, cancellationToken);
        }

        // Statistics.
        var stats = await _statistics.GetByAssetIdAsync(reference.AssetId, cancellationToken);
        if (stats is null)
        {
            stats = new MediaUsageStatistics(reference.AssetId, request.TenantId, request.ActorId);
            stats.RecordReferenceAdded(request.ActorId);
            await _statistics.AddAsync(stats, cancellationToken);
        }
        else
        {
            stats.RecordReferenceAdded(request.ActorId);
            await _statistics.UpdateAsync(stats, cancellationToken);
        }

        // Graph edge: asset ← content.
        var assetNode = MediaRelation.AssetNode(reference.AssetId);
        var contentNode = MediaRelation.ContentNode(reference.ReferenceType.Value, reference.SourceReferenceId.Value);
        var relation = new MediaRelation(assetNode, GraphNodeType.Asset, contentNode, GraphNodeType.Content, usageType.Value, request.TenantId, request.ActorId);
        var existingRelation = await _relations.GetByDeduplicationKeyAsync(relation.DeduplicationKey, cancellationToken);
        if (existingRelation is null)
        {
            await _relations.AddAsync(relation, cancellationToken);
        }
    }
}

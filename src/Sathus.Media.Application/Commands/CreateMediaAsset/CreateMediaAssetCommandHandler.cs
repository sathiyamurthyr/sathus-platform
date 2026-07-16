using MediatR;
using Sathus.Media.Application.DTOs;
using Sathus.Media.Application.Interfaces;
using Sathus.Media.Domain;
using Sathus.Media.Domain.Entities;
using Sathus.Media.Domain.Enums;
using Sathus.Media.Domain.Exceptions;
using Sathus.Media.Domain.ValueObjects;

namespace Sathus.Media.Application.Commands.CreateMediaAsset;

public sealed class CreateMediaAssetCommandHandler : IRequestHandler<CreateMediaAssetCommand, MediaAssetResponse>
{
    private readonly IMediaRepository _repository;
    private readonly IMediaSearchProvider _search;
    private readonly IMediaAuditService _audit;

    public CreateMediaAssetCommandHandler(
        IMediaRepository repository,
        IMediaSearchProvider search,
        IMediaAuditService audit)
    {
        _repository = repository;
        _search = search;
        _audit = audit;
    }

    public async Task<MediaAssetResponse> Handle(CreateMediaAssetCommand request, CancellationToken cancellationToken)
    {
        if (!Enum.TryParse<MediaStatus>(request.InitialStatus, ignoreCase: true, out var status))
        {
            status = MediaStatus.Draft;
        }

        var asset = MediaAsset.Create(
            FileName.Create(request.FileName),
            FileExtension.Create(request.FileExtension),
            MimeType.Create(request.MimeType),
            FileSize.Create(request.Size),
            Checksum.Create(request.Checksum),
            StorageKey.Create(request.StorageKey),
            MediaType.Create(request.Type),
            LanguageCode.Create(request.Language),
            ownerId: request.OwnerId,
            tenantId: request.TenantId,
            folderId: request.FolderId,
            initialStatus: status,
            createdBy: request.ActorId,
            altText: AltText.Create(request.AltText),
            dimensions: request.Width.HasValue && request.Height.HasValue
                ? ImageDimensions.Create(request.Width.Value, request.Height.Value)
                : null,
            duration: Duration.FromSeconds(request.DurationSeconds ?? 0),
            hash: Hash.Create(request.Hash),
            title: request.Title,
            description: request.Description);

        await _repository.AddAsync(asset, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);

        await _search.IndexAsync(asset, cancellationToken);

        await _audit.LogAsync(new MediaAuditEntry(
            "MediaCreated",
            asset.Id,
            request.ActorId,
            $"Created {asset.Type.Value} asset '{asset.FileName.Value}'."), cancellationToken);

        return MediaAssetResponse.From(asset);
    }
}

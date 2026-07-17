using MediatR;
using Sathus.Media.Application.DTOs;
using Sathus.Media.Application.Interfaces;
using Sathus.Media.Application.Specifications;
using Sathus.Media.Domain;
using Sathus.Media.Domain.Exceptions;
using Sathus.Media.Domain.ValueObjects;

namespace Sathus.Media.Application.Commands.UpdateMediaMetadata;

public sealed class UpdateMediaMetadataCommandHandler : IRequestHandler<UpdateMediaMetadataCommand, MediaAssetResponse>
{
    private readonly IMediaRepository _repository;
    private readonly IMediaAuditService _audit;

    public UpdateMediaMetadataCommandHandler(IMediaRepository repository, IMediaAuditService audit)
    {
        _repository = repository;
        _audit = audit;
    }

    public async Task<MediaAssetResponse> Handle(UpdateMediaMetadataCommand request, CancellationToken cancellationToken)
    {
        var asset = await _repository.GetSingleAsync(new MediaAssetDetailSpecification(request.Id), cancellationToken)
                   ?? throw new MediaAssetNotFoundException(request.Id);

        asset.UpdateMetadata(
            AltText.Create(request.AltText),
            request.Language is not null ? LanguageCode.Create(request.Language) : asset.Language,
            request.Title,
            request.Description,
            request.FolderId,
            request.ActorId);

        await _repository.UpdateAsync(asset, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);

        await _audit.LogAsync(new MediaAuditEntry(
            "MediaUpdated",
            asset.Id,
            request.ActorId,
            "Updated asset metadata."), cancellationToken);

        return MediaAssetResponse.From(asset);
    }
}

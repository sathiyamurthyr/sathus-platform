using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Sathus.Content.Application.DTOs;
using Sathus.Content.Application.Interfaces;
using Sathus.Content.Domain.Entities;
using Sathus.Content.Application.Commands.CreateMediaAsset;

namespace Sathus.Content.Application.Commands.CreateMediaAsset;

public sealed class CreateMediaAssetCommandHandler : IRequestHandler<CreateMediaAssetCommand, MediaAssetResponse>
{
    private readonly IMediaAssetRepository _mediaAssets;
    private readonly IAuditService _audit;

    public CreateMediaAssetCommandHandler(IMediaAssetRepository mediaAssets, IAuditService audit)
    {
        _mediaAssets = mediaAssets;
        _audit = audit;
    }

    public async Task<MediaAssetResponse> Handle(CreateMediaAssetCommand request, CancellationToken cancellationToken)
    {
        var asset = new MediaAsset(
            request.Filename,
            request.OriginalName,
            request.MimeType,
            request.Size,
            request.Url);

        asset.UpdateAltText(request.AltText);

        await _mediaAssets.AddAsync(asset, cancellationToken);

        await _audit.LogAsync(
            new AuditEntry("CreateMediaAsset", nameof(MediaAsset), asset.Id, EntityId: asset.Id.ToString()),
            cancellationToken);

        return new MediaAssetResponse(asset.Id, asset.Filename, asset.OriginalName, asset.MimeType, asset.Size, asset.Url, asset.AltText);
    }
}

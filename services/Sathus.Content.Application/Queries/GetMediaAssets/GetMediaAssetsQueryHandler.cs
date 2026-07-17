using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Sathus.Content.Application.DTOs;
using Sathus.Content.Application.Interfaces;
using Sathus.Content.Application.Queries.GetMediaAssets;

namespace Sathus.Content.Application.Queries.GetMediaAssets;

public sealed class GetMediaAssetsQueryHandler : IRequestHandler<GetMediaAssetsQuery, IReadOnlyList<MediaAssetResponse>>
{
    private readonly IMediaAssetRepository _mediaAssets;

    public GetMediaAssetsQueryHandler(IMediaAssetRepository mediaAssets)
    {
        _mediaAssets = mediaAssets;
    }

    public async Task<IReadOnlyList<MediaAssetResponse>> Handle(GetMediaAssetsQuery request, CancellationToken cancellationToken)
    {
        var mediaAssets = await _mediaAssets.GetAllAsync(cancellationToken);

        var result = new List<MediaAssetResponse>(mediaAssets.Count);
        foreach (var asset in mediaAssets)
        {
            result.Add(new MediaAssetResponse(asset.Id, asset.Filename, asset.OriginalName, asset.MimeType, asset.Size, asset.Url, asset.AltText));
        }

        return result;
    }
}

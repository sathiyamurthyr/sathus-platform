using MediatR;
using Sathus.Content.Application.DTOs;

namespace Sathus.Content.Application.Queries.GetMediaAssets;

public sealed record GetMediaAssetsQuery : IRequest<IReadOnlyList<MediaAssetResponse>>;

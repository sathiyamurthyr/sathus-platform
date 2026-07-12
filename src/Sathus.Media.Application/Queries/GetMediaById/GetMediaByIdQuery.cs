using MediatR;
using Sathus.Media.Application.DTOs;

namespace Sathus.Media.Application.Queries.GetMediaById;

public sealed record GetMediaByIdQuery(Guid Id) : IRequest<MediaAssetDetailResponse>;

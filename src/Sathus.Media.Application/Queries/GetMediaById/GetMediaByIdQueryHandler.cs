using MediatR;
using Sathus.Media.Application.DTOs;
using Sathus.Media.Application.Interfaces;
using Sathus.Media.Application.Specifications;
using Sathus.Media.Domain.Exceptions;

namespace Sathus.Media.Application.Queries.GetMediaById;

public sealed class GetMediaByIdQueryHandler : IRequestHandler<GetMediaByIdQuery, MediaAssetDetailResponse>
{
    private readonly IMediaRepository _repository;

    public GetMediaByIdQueryHandler(IMediaRepository repository)
    {
        _repository = repository;
    }

    public async Task<MediaAssetDetailResponse> Handle(GetMediaByIdQuery request, CancellationToken cancellationToken)
    {
        var asset = await _repository.GetSingleAsync(new MediaAssetDetailSpecification(request.Id), cancellationToken)
                   ?? throw new MediaAssetNotFoundException(request.Id);

        return MediaAssetDetailResponse.From(asset);
    }
}

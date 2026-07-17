using MediatR;
using Sathus.Media.Application.DTOs;
using Sathus.Media.Application.Interfaces;

namespace Sathus.Media.Application.Queries.GetMediaUsage;

public sealed class GetMediaUsageQueryHandler : IRequestHandler<GetMediaUsageQuery, IReadOnlyList<MediaUsageResponse>>
{
    private readonly IMediaUsageRepository _repository;

    public GetMediaUsageQueryHandler(IMediaUsageRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<MediaUsageResponse>> Handle(GetMediaUsageQuery request, CancellationToken cancellationToken)
    {
        var usages = await _repository.GetByAssetIdAsync(request.AssetId, cancellationToken);
        return usages.Select(MediaUsageResponse.From).ToList();
    }
}

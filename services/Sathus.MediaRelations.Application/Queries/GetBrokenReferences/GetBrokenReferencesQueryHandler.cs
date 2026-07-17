using MediatR;
using Sathus.MediaRelations.Application.DTOs;
using Sathus.MediaRelations.Application.Interfaces;
using Sathus.MediaRelations.Application.Specifications;
using Sathus.SharedKernel.Paging;

namespace Sathus.MediaRelations.Application.Queries.GetBrokenReferences;

public sealed class GetBrokenReferencesQueryHandler
    : IRequestHandler<GetBrokenReferencesQuery, PagedResult<MediaReferenceResponse>>
{
    private readonly IMediaReferenceRepository _references;

    public GetBrokenReferencesQueryHandler(IMediaReferenceRepository references)
    {
        _references = references;
    }

    public async Task<PagedResult<MediaReferenceResponse>> Handle(GetBrokenReferencesQuery request, CancellationToken cancellationToken)
    {
        var page = request.Page < 1 ? 1 : request.Page;
        var pageSize = request.PageSize is < 1 or > 500 ? 50 : request.PageSize;

        var total = await _references.CountAsync(new BrokenReferencesSpecification(0, int.MaxValue), cancellationToken);
        var items = await _references.GetBrokenAsync((page - 1) * pageSize, pageSize, cancellationToken);

        return new PagedResult<MediaReferenceResponse>(
            items.Select(MediaReferenceResponse.From).ToList(),
            page,
            pageSize,
            total);
    }
}

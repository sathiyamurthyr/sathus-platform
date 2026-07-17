using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Sathus.Content.Application.DTOs;
using Sathus.Content.Application.Interfaces;
using Sathus.Content.Application.Queries.GetTags;

namespace Sathus.Content.Application.Queries.GetTags;

public sealed class GetTagsQueryHandler : IRequestHandler<GetTagsQuery, IReadOnlyList<TagResponse>>
{
    private readonly ITagRepository _tags;

    public GetTagsQueryHandler(ITagRepository tags)
    {
        _tags = tags;
    }

    public async Task<IReadOnlyList<TagResponse>> Handle(GetTagsQuery request, CancellationToken cancellationToken)
    {
        var tags = await _tags.GetAllAsync(cancellationToken);

        var result = new List<TagResponse>(tags.Count);
        foreach (var tag in tags)
        {
            result.Add(new TagResponse(tag.Id, tag.Name, tag.Slug));
        }

        return result;
    }
}

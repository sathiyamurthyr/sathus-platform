using System.Collections.Generic;
using System.Linq;
using MediatR;
using Sathus.Media.Application.DTOs;
using Sathus.Media.Application.Interfaces;

namespace Sathus.Media.Application.Queries.GetFolderTree;

public sealed class GetFolderTreeQueryHandler : IRequestHandler<GetFolderTreeQuery, FolderTreeResponse>
{
    private readonly IMediaFolderRepository _repository;

    public GetFolderTreeQueryHandler(IMediaFolderRepository repository)
    {
        _repository = repository;
    }

    public async Task<FolderTreeResponse> Handle(GetFolderTreeQuery request, CancellationToken cancellationToken)
    {
        var folders = (await _repository.GetAllAsync(cancellationToken))
            .Where(f => request.TenantId is null || f.TenantId == request.TenantId)
            .ToList();

        var byId = folders.ToDictionary(f => f.Id);
        var childrenMap = folders
            .GroupBy(f => f.ParentFolderId ?? Guid.Empty)
            .ToDictionary(g => g.Key, g => g.ToList());

        FolderTreeNode Build(Guid id)
        {
            var folder = byId[id];
            var children = (childrenMap.TryGetValue(id, out var kids) ? kids : new List<MediaFolder>())
                .Where(c => c.Id != id)
                .OrderBy(c => c.SortOrder)
                .ThenBy(c => c.Name)
                .Select(c => Build(c.Id))
                .ToList();
            return FolderTreeNode.From(folder, children);
        }

        var roots = (childrenMap.TryGetValue(Guid.Empty, out var rootFolders) ? rootFolders : new List<MediaFolder>())
            .OrderBy(f => f.SortOrder)
            .ThenBy(f => f.Name)
            .Select(f => Build(f.Id))
            .ToList();

        return new FolderTreeResponse(roots);
    }
}

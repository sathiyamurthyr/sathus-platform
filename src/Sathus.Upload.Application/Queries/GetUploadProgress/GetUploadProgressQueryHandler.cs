using MediatR;
using Sathus.Upload.Application.DTOs;
using Sathus.Upload.Application.Interfaces;
using Sathus.Upload.Domain.Entities;
using Sathus.Upload.Domain.Enums;
using Sathus.Upload.Domain.Exceptions;

namespace Sathus.Upload.Application.Queries.GetUploadProgress;

public sealed class GetUploadProgressQueryHandler : IRequestHandler<GetUploadProgressQuery, UploadProgressResponse>
{
    private readonly IUploadRepository _repository;

    public GetUploadProgressQueryHandler(IUploadRepository repository)
    {
        _repository = repository;
    }

    public async Task<UploadProgressResponse> Handle(GetUploadProgressQuery request, CancellationToken cancellationToken)
    {
        var session = await _repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new UploadSessionNotFoundException(request.Id);

        var bytesUploaded = session.Chunks
            .Where(c => c.Status == ChunkStatus.Completed)
            .Sum(c => c.Size);

        return UploadProgressResponse.From(session, bytesUploaded, 0, null);
    }
}

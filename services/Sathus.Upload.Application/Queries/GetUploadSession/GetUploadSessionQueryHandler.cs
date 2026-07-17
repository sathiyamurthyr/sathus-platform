using MediatR;
using Sathus.Upload.Application.DTOs;
using Sathus.Upload.Application.Interfaces;
using Sathus.Upload.Domain.Exceptions;

namespace Sathus.Upload.Application.Queries.GetUploadSession;

public sealed class GetUploadSessionQueryHandler : IRequestHandler<GetUploadSessionQuery, UploadSessionResponse>
{
    private readonly IUploadRepository _repository;

    public GetUploadSessionQueryHandler(IUploadRepository repository)
    {
        _repository = repository;
    }

    public async Task<UploadSessionResponse> Handle(GetUploadSessionQuery request, CancellationToken cancellationToken)
    {
        var session = await _repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new UploadSessionNotFoundException(request.Id);

        return UploadSessionResponse.From(session);
    }
}

using MediatR;
using Sathus.Upload.Application.DTOs;
using Sathus.Upload.Application.Interfaces;
using Sathus.Upload.Domain.Entities;
using Sathus.Upload.Domain.Enums;
using Sathus.Upload.Domain.Events;
using Sathus.Upload.Domain.Exceptions;

namespace Sathus.Upload.Application.Commands.CancelUpload;

public sealed record CancelUploadCommand(Guid SessionId, Guid? ActorId = null)
    : IRequest<UploadResultResponse>;

public sealed class CancelUploadCommandHandler : IRequestHandler<CancelUploadCommand, UploadResultResponse>
{
    private readonly IUploadRepository _repository;

    public CancelUploadCommandHandler(IUploadRepository repository)
    {
        _repository = repository;
    }

    public async Task<UploadResultResponse> Handle(CancelUploadCommand request, CancellationToken cancellationToken)
    {
        var session = await _repository.GetByIdAsync(request.SessionId, cancellationToken)
            ?? throw new UploadSessionNotFoundException(request.SessionId);

        session.Cancel(request.ActorId);
        await _repository.SaveChangesAsync(cancellationToken);

        return new UploadResultResponse(
            session.Id,
            session.SessionId,
            session.Status.ToString(),
            session.StorageKey?.Value,
            session.ErrorMessage,
            session.CompletedAt);
    }
}

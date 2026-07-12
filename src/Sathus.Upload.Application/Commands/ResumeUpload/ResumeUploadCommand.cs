using MediatR;
using Sathus.Upload.Application.DTOs;
using Sathus.Upload.Application.Interfaces;
using Sathus.Upload.Domain.Entities;
using Sathus.Upload.Domain.Enums;
using Sathus.Upload.Domain.Events;
using Sathus.Upload.Domain.Exceptions;

namespace Sathus.Upload.Application.Commands.ResumeUpload;

public sealed record ResumeUploadCommand(Guid SessionId, Guid? ActorId = null)
    : IRequest<UploadSessionResponse>;

public sealed class ResumeUploadCommandHandler : IRequestHandler<ResumeUploadCommand, UploadSessionResponse>
{
    private readonly IUploadRepository _repository;

    public ResumeUploadCommandHandler(IUploadRepository repository)
    {
        _repository = repository;
    }

    public async Task<UploadSessionResponse> Handle(ResumeUploadCommand request, CancellationToken cancellationToken)
    {
        var session = await _repository.GetByIdAsync(request.SessionId, cancellationToken)
            ?? throw new UploadSessionNotFoundException(request.SessionId);

        session.Resume(request.ActorId);
        await _repository.SaveChangesAsync(cancellationToken);

        return UploadSessionResponse.From(session);
    }
}

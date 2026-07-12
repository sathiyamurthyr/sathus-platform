using MediatR;
using Sathus.Upload.Application.DTOs;
using Sathus.Upload.Application.Interfaces;
using Sathus.Upload.Domain.Entities;
using Sathus.Upload.Domain.Enums;
using Sathus.Upload.Domain.Events;
using Sathus.Upload.Domain.Exceptions;

namespace Sathus.Upload.Application.Commands.StartUpload;

public sealed class StartUploadCommandHandler : IRequestHandler<StartUploadCommand, UploadSessionResponse>
{
    private readonly IUploadRepository _repository;
    private readonly IUploadValidator _validator;
    private readonly IMediator _mediator;

    public StartUploadCommandHandler(IUploadRepository repository, IUploadValidator validator, IMediator mediator)
    {
        _repository = repository;
        _validator = validator;
        _mediator = mediator;
    }

    public async Task<UploadSessionResponse> Handle(StartUploadCommand request, CancellationToken cancellationToken)
    {
        var session = new UploadSession(
            sessionId: UploadId.Create(Guid.NewGuid().ToString("N")).Value,
            fileName: FileName.Create(request.FileName),
            fileExtension: FileExtension.Create(request.FileExtension),
            mimeType: MimeType.Create(request.MimeType),
            fileSize: FileSize.Create(request.Size),
            chunkSize: request.ChunkSize,
            createdBy: request.ActorId,
            folderId: request.FolderId,
            parentSessionId: request.ParentSessionId,
            isFolder: request.IsFolder,
            folderPath: request.FolderPath,
            metadata: request.Metadata);

        session.InitializeChunks();

        await _validator.ValidateAsync(session, cancellationToken);

        await _repository.AddAsync(session, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);

        return UploadSessionResponse.From(session);
    }
}

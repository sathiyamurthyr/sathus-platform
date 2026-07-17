using MediatR;
using Sathus.Upload.Application.DTOs;
using Sathus.Upload.Application.Interfaces;
using Sathus.Upload.Domain.Entities;
using Sathus.Upload.Domain.Enums;
using Sathus.Upload.Domain.Events;
using Sathus.Upload.Domain.Exceptions;
using System.IO;

namespace Sathus.Upload.Application.Commands.CompleteUpload;

public sealed class CompleteUploadCommandHandler : IRequestHandler<CompleteUploadCommand, UploadResultResponse>
{
    private readonly IUploadRepository _repository;
    private readonly IUploadValidator _validator;
    private readonly IVirusScanService _virusScan;
    private readonly IMetadataExtractionService _metadataExtractor;
    private readonly IMediator _mediator;

    public CompleteUploadCommandHandler(IUploadRepository repository, IUploadValidator validator, IVirusScanService virusScan, IMetadataExtractionService metadataExtractor, IMediator mediator)
    {
        _repository = repository;
        _validator = validator;
        _virusScan = virusScan;
        _metadataExtractor = metadataExtractor;
        _mediator = mediator;
    }

    public async Task<UploadResultResponse> Handle(CompleteUploadCommand request, CancellationToken cancellationToken)
    {
        var session = await _repository.GetByIdAsync(request.SessionId, cancellationToken)
            ?? throw new UploadSessionNotFoundException(request.SessionId);

        if (session.Status != UploadStatus.Uploading && session.Status != UploadStatus.Paused)
            throw new InvalidUploadStateException($"Session cannot be completed in status '{session.Status}'.");

        var missingChunks = session.GetMissingChunkIndices();
        if (missingChunks.Count > 0)
            throw new InvalidUploadStateException($"Missing chunks: {string.Join(", ", missingChunks)}");

        await _validator.ValidateAsync(session, cancellationToken);

        using var emptyStream = new MemoryStream(Array.Empty<byte>());
        var isClean = await _virusScan.ScanAsync(session, emptyStream, cancellationToken);
        if (!isClean)
            throw new InvalidUploadStateException("Virus scan detected a threat.");

        var extractedMetadata = await _metadataExtractor.ExtractAsync(session, emptyStream, cancellationToken);

        foreach (var chunk in session.Chunks)
        {
            if (chunk.Status != ChunkStatus.Completed)
                chunk.MarkSkipped();
        }

        await _repository.SaveChangesAsync(cancellationToken);

        session.Complete(session.StorageKey?.Value, request.ActorId);
        await _repository.SaveChangesAsync(cancellationToken);

        var finalStorageKey = session.StorageKey?.Value ?? string.Empty;

        foreach (var kv in extractedMetadata)
        {
            session.Metadata[kv.Key] = kv.Value;
        }
        await _repository.SaveChangesAsync(cancellationToken);

        _ = _mediator.Publish(new AssetCreatedFromUploadEvent(session.Id, finalStorageKey), cancellationToken);
        _ = _mediator.Publish(new UploadAuditedEvent(session.Id, finalStorageKey, extractedMetadata), cancellationToken);

        return new UploadResultResponse(
            session.Id,
            session.SessionId,
            session.Status.ToString(),
            finalStorageKey,
            session.ErrorMessage,
            session.CompletedAt);
    }
}

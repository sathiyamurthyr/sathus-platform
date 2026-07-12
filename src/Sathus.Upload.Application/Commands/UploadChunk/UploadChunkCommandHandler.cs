using MediatR;
using Sathus.Storage.Domain.Exceptions;
using Sathus.Upload.Application.DTOs;
using Sathus.Upload.Application.Interfaces;
using Sathus.Upload.Domain.Entities;
using Sathus.Upload.Domain.Enums;
using Sathus.Upload.Domain.Exceptions;
using Sathus.Upload.Domain.ValueObjects;

namespace Sathus.Upload.Application.Commands.UploadChunk;

public sealed class UploadChunkCommandHandler : IRequestHandler<UploadChunkCommand, UploadChunkResponse>
{
    private readonly IUploadRepository _repository;
    private readonly IStorageProviderFactory _storageFactory;
    private readonly IChunkEngine _chunkEngine;
    private readonly IMediator _mediator;

    public UploadChunkCommandHandler(IUploadRepository repository, IStorageProviderFactory storageFactory, IChunkEngine chunkEngine, IMediator mediator)
    {
        _repository = repository;
        _storageFactory = storageFactory;
        _chunkEngine = chunkEngine;
        _mediator = mediator;
    }

    public async Task<UploadChunkResponse> Handle(UploadChunkCommand request, CancellationToken cancellationToken)
    {
        var session = await _repository.GetByIdAsync(request.SessionId, cancellationToken)
            ?? throw new UploadSessionNotFoundException(request.SessionId);

        if (session.Status != UploadStatus.Uploading)
            throw new InvalidUploadStateException($"Session is not in uploadable state: {session.Status}");

        var chunk = session.Chunks.FirstOrDefault(c => c.ChunkIndex == request.ChunkIndex)
            ?? throw new ChunkValidationException($"Chunk {request.ChunkIndex} not found.");

        if (chunk.Status == ChunkStatus.Completed)
            return new UploadChunkResponse(chunk.ChunkIndex, chunk.Status.ToString(), chunk.StorageKey, chunk.CompletedAt);

        chunk.MarkUploading(request.ActorId);
        await _repository.SaveChangesAsync(cancellationToken);

        try
        {
            var chunkKey = $"{session.StorageKey?.Value ?? session.SessionId}/chunks/{chunk.ChunkIndex:D6}";
            var provider = _storageFactory.Resolve();

            using var ms = new MemoryStream();
            await request.Data.CopyToAsync(ms, cancellationToken);
            ms.Position = 0;

            if (!string.IsNullOrWhiteSpace(request.Checksum))
            {
                var isValid = await _chunkEngine.ValidateChecksumAsync(ms, request.Checksum, "sha256", cancellationToken);
                if (!isValid)
                    throw new ChunkValidationException($"Checksum validation failed for chunk {chunk.ChunkIndex}.");
                ms.Position = 0;
            }

            var result = await provider.UploadAsync(chunkKey, ms, session.MimeType.Value, null, cancellationToken);
            if (!result.Succeeded)
                throw new UploadFailedException(chunkKey);

            chunk.MarkCompleted(chunkKey, request.ActorId);
            session.MarkChunkCompleted(chunk.ChunkIndex, chunkKey, request.ActorId);

            await _repository.SaveChangesAsync(cancellationToken);

            return new UploadChunkResponse(chunk.ChunkIndex, chunk.Status.ToString(), chunk.StorageKey, chunk.CompletedAt);
        }
        catch
        {
            session.MarkChunkFailed(chunk.ChunkIndex, request.ActorId);
            await _repository.SaveChangesAsync(cancellationToken);
            throw;
        }
    }
}

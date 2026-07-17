using MediatR;
using Sathus.Media.Domain.ValueObjects;
using Sathus.Processing.Application.DTOs;
using Sathus.Processing.Application.Interfaces;
using Sathus.Processing.Domain.Entities;

namespace Sathus.Processing.Application.Commands.EnqueueAssetProcessing;

public sealed class EnqueueAssetProcessingCommandHandler
    : IRequestHandler<EnqueueAssetProcessingCommand, EnqueueAssetProcessingResponse>
{
    private readonly IProcessingJobRepository _repository;
    private readonly IProcessingJobQueue _queue;

    public EnqueueAssetProcessingCommandHandler(IProcessingJobRepository repository, IProcessingJobQueue queue)
    {
        _repository = repository;
        _queue = queue;
    }

    public async Task<EnqueueAssetProcessingResponse> Handle(EnqueueAssetProcessingCommand request, CancellationToken cancellationToken)
    {
        var mediaType = MediaType.Create(request.MediaType);

        var job = new AssetProcessingJob(
            request.AssetId,
            request.StorageKey,
            request.FileName,
            request.MimeType,
            mediaType,
            request.FileSize,
            request.MaxRetries,
            request.ActorId,
            request.TenantId,
            request.Metadata);

        await _repository.AddAsync(job, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);
        await _queue.EnqueueAsync(job.Id, cancellationToken);

        return new EnqueueAssetProcessingResponse(job.Id, job.AssetId, job.Status.ToString());
    }
}

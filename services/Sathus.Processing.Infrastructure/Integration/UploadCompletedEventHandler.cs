using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Sathus.Media.Domain.ValueObjects;
using Sathus.Processing.Application.Commands.EnqueueAssetProcessing;
using Sathus.Processing.Domain.Enums;
using Sathus.Upload.Application.Interfaces;
using Sathus.Upload.Domain.Events;

namespace Sathus.Processing.Infrastructure.Integration;

/// <summary>
/// Bridges the Upload Engine and the Processing module. When an upload completes, a
/// processing job is enqueued for the uploaded asset so the asynchronous pipeline
/// (validation, virus scan, metadata, checksum, duplicate detection, processors) runs.
/// </summary>
public sealed class UploadCompletedEventHandler : INotificationHandler<UploadCompletedEvent>
{
    private readonly IMediator _mediator;
    private readonly IUploadRepository _uploadRepository;

    public UploadCompletedEventHandler(IMediator mediator, IUploadRepository uploadRepository)
    {
        _mediator = mediator;
        _uploadRepository = uploadRepository;
    }

    public async Task Handle(UploadCompletedEvent notification, CancellationToken cancellationToken)
    {
        var session = await _uploadRepository.GetByIdAsync(notification.SessionId, cancellationToken);
        if (session is null || session.StorageKey is null)
        {
            return;
        }

        var mediaType = MediaType.Create(session.MimeType.Value.Split('/')[0]);
        var assetId = session.Id;

        await _mediator.Send(new EnqueueAssetProcessingCommand(
            assetId,
            session.StorageKey.Value,
            session.FileName.Value,
            session.MimeType.Value,
            mediaType.Value,
            session.FileSize.Bytes,
            ActorId: session.ActorId,
            TenantId: session.TenantId,
            Metadata: session.Metadata.Count > 0 ? new Dictionary<string, string>(session.Metadata) : null),
            cancellationToken);
    }
}

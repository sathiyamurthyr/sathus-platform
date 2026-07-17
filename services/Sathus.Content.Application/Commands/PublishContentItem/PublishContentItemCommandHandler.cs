using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Sathus.Content.Application.Exceptions;
using Sathus.Content.Application.Interfaces;
using Sathus.Content.Domain.Events;
using Sathus.Content.Domain.Enums;
using Sathus.Content.Application.Commands.PublishContentItem;

namespace Sathus.Content.Application.Commands.PublishContentItem;

public sealed class PublishContentItemCommandHandler : IRequestHandler<PublishContentItemCommand, Unit>
{
    private readonly IContentItemRepository _contentItems;
    private readonly IAuditService _audit;

    public PublishContentItemCommandHandler(IContentItemRepository contentItems, IAuditService audit)
    {
        _contentItems = contentItems;
        _audit = audit;
    }

    public async Task<Unit> Handle(PublishContentItemCommand request, CancellationToken cancellationToken)
    {
        var contentItem = await _contentItems.GetByIdAsync(request.ContentItemId, cancellationToken);
        if (contentItem is null)
        {
            throw new ContentItemNotFoundException($"Content item '{request.ContentItemId}' was not found.");
        }

        var now = DateTime.UtcNow;
        contentItem.Publish(now);
        await _contentItems.UpdateAsync(contentItem, cancellationToken);

        await _audit.LogAsync(
            new AuditEntry("PublishContentItem", nameof(ContentItem), contentItem.Id, EntityId: contentItem.Id.ToString()),
            cancellationToken);

        return Unit.Value;
    }
}

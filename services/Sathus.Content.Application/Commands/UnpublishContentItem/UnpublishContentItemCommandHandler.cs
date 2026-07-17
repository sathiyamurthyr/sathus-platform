using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Sathus.Content.Application.Exceptions;
using Sathus.Content.Application.Interfaces;
using Sathus.Content.Application.Commands.UnpublishContentItem;

namespace Sathus.Content.Application.Commands.UnpublishContentItem;

public sealed class UnpublishContentItemCommandHandler : IRequestHandler<UnpublishContentItemCommand, Unit>
{
    private readonly IContentItemRepository _contentItems;
    private readonly IAuditService _audit;

    public UnpublishContentItemCommandHandler(IContentItemRepository contentItems, IAuditService audit)
    {
        _contentItems = contentItems;
        _audit = audit;
    }

    public async Task<Unit> Handle(UnpublishContentItemCommand request, CancellationToken cancellationToken)
    {
        var contentItem = await _contentItems.GetByIdAsync(request.ContentItemId, cancellationToken);
        if (contentItem is null)
        {
            throw new ContentItemNotFoundException($"Content item '{request.ContentItemId}' was not found.");
        }

        contentItem.Unpublish();
        await _contentItems.UpdateAsync(contentItem, cancellationToken);

        await _audit.LogAsync(
            new AuditEntry("UnpublishContentItem", nameof(ContentItem), contentItem.Id, EntityId: contentItem.Id.ToString()),
            cancellationToken);

        return Unit.Value;
    }
}

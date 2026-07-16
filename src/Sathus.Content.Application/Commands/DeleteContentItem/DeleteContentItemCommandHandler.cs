using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Sathus.Content.Application.Exceptions;
using Sathus.Content.Application.Interfaces;
using Sathus.Content.Domain.Events;
using Sathus.Content.Application.Commands.DeleteContentItem;

namespace Sathus.Content.Application.Commands.DeleteContentItem;

public sealed class DeleteContentItemCommandHandler : IRequestHandler<DeleteContentItemCommand, Unit>
{
    private readonly IContentItemRepository _contentItems;
    private readonly IAuditService _audit;

    public DeleteContentItemCommandHandler(IContentItemRepository contentItems, IAuditService audit)
    {
        _contentItems = contentItems;
        _audit = audit;
    }

    public async Task<Unit> Handle(DeleteContentItemCommand request, CancellationToken cancellationToken)
    {
        var contentItem = await _contentItems.GetByIdAsync(request.ContentItemId, cancellationToken);
        if (contentItem is null)
        {
            throw new ContentItemNotFoundException($"Content item '{request.ContentItemId}' was not found.");
        }

        contentItem.Archive();
        await _contentItems.UpdateAsync(contentItem, cancellationToken);

        await _audit.LogAsync(
            new AuditEntry("DeleteContentItem", nameof(ContentItem), contentItem.Id, EntityId: contentItem.Id.ToString()),
            cancellationToken);

        return Unit.Value;
    }
}

using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Sathus.Content.Application.Exceptions;
using Sathus.Content.Application.Interfaces;
using Sathus.Content.Application.Commands.DeleteCategory;

namespace Sathus.Content.Application.Commands.DeleteCategory;

public sealed class DeleteCategoryCommandHandler : IRequestHandler<DeleteCategoryCommand, Unit>
{
    private readonly ICategoryRepository _categories;
    private readonly IAuditService _audit;

    public DeleteCategoryCommandHandler(ICategoryRepository categories, IAuditService audit)
    {
        _categories = categories;
        _audit = audit;
    }

    public async Task<Unit> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _categories.GetByIdAsync(request.CategoryId, cancellationToken);
        if (category is null)
        {
            throw new CategoryNotFoundException($"Category '{request.CategoryId}' was not found.");
        }

        await _categories.DeleteAsync(category, cancellationToken);

        await _audit.LogAsync(
            new AuditEntry("DeleteCategory", nameof(Category), category.Id, EntityId: category.Id.ToString()),
            cancellationToken);

        return Unit.Value;
    }
}

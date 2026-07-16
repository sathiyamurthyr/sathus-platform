using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Sathus.Content.Application.DTOs;
using Sathus.Content.Application.Exceptions;
using Sathus.Content.Application.Interfaces;
using Sathus.Content.Application.Commands.UpdateCategory;

namespace Sathus.Content.Application.Commands.UpdateCategory;

public sealed class UpdateCategoryCommandHandler : IRequestHandler<UpdateCategoryCommand, CategoryResponse>
{
    private readonly ICategoryRepository _categories;
    private readonly IAuditService _audit;

    public UpdateCategoryCommandHandler(ICategoryRepository categories, IAuditService audit)
    {
        _categories = categories;
        _audit = audit;
    }

    public async Task<CategoryResponse> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _categories.GetByIdAsync(request.CategoryId, cancellationToken);
        if (category is null)
        {
            throw new CategoryNotFoundException($"Category '{request.CategoryId}' was not found.");
        }

        category.Update(request.Name, request.Description);
        await _categories.UpdateAsync(category, cancellationToken);

        await _audit.LogAsync(
            new AuditEntry("UpdateCategory", nameof(Category), category.Id, EntityId: category.Id.ToString()),
            cancellationToken);

        return new CategoryResponse(category.Id, category.Name, category.Slug, category.Description);
    }
}

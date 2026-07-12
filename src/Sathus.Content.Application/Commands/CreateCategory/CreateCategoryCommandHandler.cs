using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Sathus.Content.Application.DTOs;
using Sathus.Content.Application.Exceptions;
using Sathus.Content.Application.Interfaces;
using Sathus.Content.Domain.Entities;
using Sathus.Content.Domain.ValueObjects;
using Sathus.Content.Application.Commands.CreateCategory;

namespace Sathus.Content.Application.Commands.CreateCategory;

public sealed class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, CategoryResponse>
{
    private readonly ICategoryRepository _categories;
    private readonly IAuditService _audit;

    public CreateCategoryCommandHandler(ICategoryRepository categories, IAuditService audit)
    {
        _categories = categories;
        _audit = audit;
    }

    public async Task<CategoryResponse> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        var slug = Slug.Create(request.Slug);

        if (await _categories.ExistsBySlugAsync(slug.Value, cancellationToken))
        {
            throw new CategoryAlreadyExistsException($"A category with slug '{slug.Value}' already exists.");
        }

        var category = new Category(request.Name, slug.Value);
        category.Update(request.Name, request.Description);

        await _categories.AddAsync(category, cancellationToken);

        await _audit.LogAsync(
            new AuditEntry("CreateCategory", nameof(Category), category.Id, EntityId: category.Id.ToString()),
            cancellationToken);

        return new CategoryResponse(category.Id, category.Name, category.Slug, category.Description);
    }
}

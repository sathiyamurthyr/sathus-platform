using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Sathus.Content.Application.DTOs;
using Sathus.Content.Application.Interfaces;
using Sathus.Content.Application.Queries.GetCategories;

namespace Sathus.Content.Application.Queries.GetCategories;

public sealed class GetCategoriesQueryHandler : IRequestHandler<GetCategoriesQuery, IReadOnlyList<CategoryResponse>>
{
    private readonly ICategoryRepository _categories;

    public GetCategoriesQueryHandler(ICategoryRepository categories)
    {
        _categories = categories;
    }

    public async Task<IReadOnlyList<CategoryResponse>> Handle(GetCategoriesQuery request, CancellationToken cancellationToken)
    {
        var categories = await _categories.GetAllAsync(cancellationToken);

        var result = new List<CategoryResponse>(categories.Count);
        foreach (var category in categories)
        {
            result.Add(new CategoryResponse(category.Id, category.Name, category.Slug, category.Description));
        }

        return result;
    }
}

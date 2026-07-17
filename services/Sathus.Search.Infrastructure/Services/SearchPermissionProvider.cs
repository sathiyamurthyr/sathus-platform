using Microsoft.Extensions.Logging;
using Sathus.Search.Application.Interfaces;
using Sathus.Search.Domain.Enums;
using Sathus.Search.Domain.ValueObjects;

namespace Sathus.Search.Infrastructure.Services;

public sealed class SearchPermissionProvider : ISearchPermissionProvider
{
    private readonly ILogger<SearchPermissionProvider> _logger;

    public SearchPermissionProvider(ILogger<SearchPermissionProvider> logger)
    {
        _logger = logger;
    }

    public Task<IReadOnlyList<SearchFilter>> GetFiltersForUserAsync(string userId, string userRoles, CancellationToken cancellationToken)
    {
        var filters = new List<SearchFilter>();

        if (!string.IsNullOrWhiteSpace(userId))
        {
            filters.Add(SearchFilter.Create("allowed_users", userId, FilterOperator.In));
        }

        if (!string.IsNullOrWhiteSpace(userRoles))
        {
            filters.Add(SearchFilter.Create("required_roles", userRoles, FilterOperator.In));
        }

        return Task.FromResult<IReadOnlyList<SearchFilter>>(filters);
    }
}

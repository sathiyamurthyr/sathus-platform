using Microsoft.Extensions.Logging;
using Sathus.Search.Application.DTOs;
using Sathus.Search.Application.Interfaces;
using Sathus.Search.Domain.Entities;
using Sathus.Search.Domain.Enums;

namespace Sathus.Search.Infrastructure.Services;

public sealed class SearchRanker : ISearchRanker
{
    private readonly ILogger<SearchRanker> _logger;

    public SearchRanker(ILogger<SearchRanker> logger)
    {
        _logger = logger;
    }

    public double CalculateScore(SearchResultItem item, IReadOnlyList<SearchRanking> rankings, string? query = null)
    {
        var score = item.Score;

        foreach (var ranking in rankings.OrderByDescending(r => r.Boost))
        {
            if (!string.IsNullOrWhiteSpace(query) && !query.Contains(ranking.Query, StringComparison.OrdinalIgnoreCase))
            {
                continue;
            }

            score *= ranking.Boost;
        }

        return score;
    }
}

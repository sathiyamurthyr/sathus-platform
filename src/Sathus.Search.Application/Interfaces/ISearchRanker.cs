using Sathus.Search.Domain.Entities;
using Sathus.Search.Application.DTOs;
using Sathus.Search.Domain.Entities;
using Sathus.Search.Domain.Enums;

namespace Sathus.Search.Application.Interfaces;

public interface ISearchRanker
{
    double CalculateScore(SearchResultItem item, IReadOnlyList<SearchRanking> rankings, string? query = null);
}

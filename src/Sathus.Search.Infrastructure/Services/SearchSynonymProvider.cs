using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Sathus.Search.Application.Interfaces;
using Sathus.Search.Domain.Entities;

namespace Sathus.Search.Infrastructure.Services;

public sealed class SearchSynonymProvider : ISearchSynonymProvider
{
    private readonly ISearchRepository _repository;
    private readonly IMemoryCache _cache;
    private readonly ILogger<SearchSynonymProvider> _logger;

    public SearchSynonymProvider(ISearchRepository repository, IMemoryCache cache, ILogger<SearchSynonymProvider> logger)
    {
        _repository = repository;
        _cache = cache;
        _logger = logger;
    }

    public async Task<IReadOnlyDictionary<string, string>> GetSynonymsAsync(string indexCode, CancellationToken cancellationToken)
    {
        return await _cache.GetOrCreateAsync(indexCode, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30);
            entry.SlidingExpiration = TimeSpan.FromMinutes(30);

            var index = await _repository.GetByCodeAsync(indexCode, cancellationToken);
            if (index is null)
            {
                return new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
            }

            var synonyms = index.Synonyms.Where(s => s.IsEnabled).ToList();
            return synonyms.ToDictionary(s => s.From, s => s.To, StringComparer.OrdinalIgnoreCase);
        }) ?? new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
    }
}

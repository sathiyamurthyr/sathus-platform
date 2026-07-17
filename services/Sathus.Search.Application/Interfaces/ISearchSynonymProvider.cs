namespace Sathus.Search.Application.Interfaces;

public interface ISearchSynonymProvider
{
    Task<IReadOnlyDictionary<string, string>> GetSynonymsAsync(string indexCode, CancellationToken cancellationToken);
}

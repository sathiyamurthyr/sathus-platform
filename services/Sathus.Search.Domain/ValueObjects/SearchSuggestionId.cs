using Sathus.SharedKernel.Entities;

namespace Sathus.Search.Domain.ValueObjects;

public sealed class SearchSuggestionId : EntityId
{
    public SearchSuggestionId(Guid value) : base(value) { }

    public static SearchSuggestionId Create(Guid value) => new(value);
    public static SearchSuggestionId CreateUnique() => new(Guid.NewGuid());
}

using Sathus.SharedKernel.Entities;

namespace Sathus.Search.Domain.ValueObjects;

public sealed class SearchSynonymId : EntityId
{
    public SearchSynonymId(Guid value) : base(value) { }

    public static SearchSynonymId Create(Guid value) => new(value);
    public static SearchSynonymId CreateUnique() => new(Guid.NewGuid());
}

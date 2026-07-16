using Sathus.SharedKernel.Entities;

namespace Sathus.Search.Domain.ValueObjects;

public sealed class SearchRankingId : EntityId
{
    public SearchRankingId(Guid value) : base(value) { }

    public static SearchRankingId Create(Guid value) => new(value);
    public static SearchRankingId CreateUnique() => new(Guid.NewGuid());
}

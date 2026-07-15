using Sathus.SharedKernel.Entities;

namespace Sathus.Search.Domain.ValueObjects;

public sealed class SearchFacetId : EntityId
{
    public SearchFacetId(Guid value) : base(value) { }

    public static SearchFacetId Create(Guid value) => new(value);
    public static SearchFacetId CreateUnique() => new(Guid.NewGuid());
}

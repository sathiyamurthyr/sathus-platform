using Sathus.SharedKernel.Entities;

namespace Sathus.Search.Domain.ValueObjects;

public sealed class SearchHighlightId : EntityId
{
    public SearchHighlightId(Guid value) : base(value) { }

    public static SearchHighlightId Create(Guid value) => new(value);
    public static SearchHighlightId CreateUnique() => new(Guid.NewGuid());
}

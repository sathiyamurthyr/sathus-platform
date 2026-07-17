using Sathus.SharedKernel.Entities;

namespace Sathus.Search.Domain.ValueObjects;

public sealed class SearchFieldId : EntityId
{
    public SearchFieldId(Guid value) : base(value) { }

    public static SearchFieldId Create(Guid value) => new(value);
    public static SearchFieldId CreateUnique() => new(Guid.NewGuid());
}

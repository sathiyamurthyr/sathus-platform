using Sathus.SharedKernel.Entities;

namespace Sathus.Search.Domain.ValueObjects;

public sealed class SearchDocumentId : EntityId
{
    public SearchDocumentId(Guid value) : base(value) { }

    public static SearchDocumentId Create(Guid value) => new(value);
    public static SearchDocumentId CreateUnique() => new(Guid.NewGuid());
}

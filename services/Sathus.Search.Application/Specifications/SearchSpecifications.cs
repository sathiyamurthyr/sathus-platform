using Sathus.Search.Domain.Entities;
using Sathus.Search.Domain.Enums;
using Sathus.Search.Domain.ValueObjects;
using Sathus.SharedKernel.Specifications;

namespace Sathus.Search.Application.Specifications;

public sealed class SearchDocumentsByIndexSpec : Specification<SearchDocument>
{
    public SearchDocumentsByIndexSpec(Guid indexId) => Criteria = d => d.IndexId == indexId && !d.IsDeleted;
}

public sealed class SearchDocumentsBySourceTypeSpec : Specification<SearchDocument>
{
    public SearchDocumentsBySourceTypeSpec(IndexSourceType sourceType) => Criteria = d => d.SourceType == sourceType && !d.IsDeleted;
}

public sealed class SearchDocumentsByStatusSpec : Specification<SearchDocument>
{
    public SearchDocumentsByStatusSpec(DocumentStatus status) => Criteria = d => d.Status == status && !d.IsDeleted;
}

public sealed class SearchDocumentsByExternalIdSpec : Specification<SearchDocument>
{
    public SearchDocumentsByExternalIdSpec(Guid indexId, string externalId) => Criteria = d => d.IndexId == indexId && d.ExternalId == externalId && !d.IsDeleted;
}

public sealed class EnabledSearchIndexesSpec : Specification<SearchIndex>
{
    public EnabledSearchIndexesSpec() => Criteria = i => i.IsEnabled && !i.IsDeleted;
}

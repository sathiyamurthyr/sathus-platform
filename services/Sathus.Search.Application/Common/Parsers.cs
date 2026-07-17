using Sathus.Search.Domain.Enums;

namespace Sathus.Search.Application.Common;

public static class Parsers
{
    public static DocumentStatus ParseDocumentStatus(string value) => value.ToLowerInvariant() switch
    {
        "draft" => DocumentStatus.Draft,
        "published" => DocumentStatus.Published,
        "archived" => DocumentStatus.Archived,
        "expired" => DocumentStatus.Expired,
        _ => throw new ArgumentException($"Unknown document status: {value}")
    };

    public static IndexSourceType ParseIndexSourceType(string value) => value.ToLowerInvariant() switch
    {
        "page" => IndexSourceType.Page,
        "product" => IndexSourceType.Product,
        "documentation" => IndexSourceType.Documentation,
        "blog" => IndexSourceType.Blog,
        "media" => IndexSourceType.Media,
        "navigation" => IndexSourceType.Navigation,
        "form" => IndexSourceType.Form,
        "user" => IndexSourceType.User,
        "knowledgebase" => IndexSourceType.KnowledgeBase,
        _ => throw new ArgumentException($"Unknown index source type: {value}")
    };

    public static SearchProviderType ParseSearchProviderType(string value) => value.ToLowerInvariant() switch
    {
        "postgresql" => SearchProviderType.PostgreSQL,
        "meilisearch" => SearchProviderType.Meilisearch,
        "opensearch" => SearchProviderType.OpenSearch,
        "elasticsearch" => SearchProviderType.Elasticsearch,
        "azureaisearch" => SearchProviderType.AzureAiSearch,
        _ => throw new ArgumentException($"Unknown search provider type: {value}")
    };
}

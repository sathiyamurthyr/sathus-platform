using System.Data;
using System.Diagnostics;
using Microsoft.Extensions.Configuration;
using Npgsql;
using Sathus.Search.Application.Interfaces;
using Sathus.Search.Domain.Entities;
using Sathus.Search.Domain.Enums;
using Sathus.Search.Domain.ValueObjects;

namespace Sathus.Search.Infrastructure.Services;

public sealed class PostgreSqlSearchProvider : ISearchProvider
{
    private readonly string _connectionString;

    public PostgreSqlSearchProvider(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection") ?? string.Empty;
    }

    public async Task InitializeIndexAsync(SearchIndex index, CancellationToken cancellationToken)
    {
        await using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        await using var schemaCommand = new NpgsqlCommand("CREATE SCHEMA IF NOT EXISTS search", connection);
        await schemaCommand.ExecuteNonQueryAsync(cancellationToken);

        await using var tableCommand = new NpgsqlCommand(@"
            CREATE TABLE IF NOT EXISTS search.documents (
                id uuid PRIMARY KEY,
                external_id varchar(256),
                index_id uuid,
                source_type varchar(32),
                title text,
                content text,
                url text,
                image_url text,
                author_id uuid,
                author_name varchar(256),
                language varchar(10),
                status varchar(32),
                is_featured boolean,
                score double precision,
                metadata jsonb,
                indexed_at timestamptz,
                published_at timestamptz,
                expires_at timestamptz,
                permission_scope varchar(32),
                required_roles text[],
                allowed_users text[],
                created_at timestamptz,
                updated_at timestamptz,
                is_deleted boolean,
                tsv tsvector GENERATED ALWAYS AS (
                    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
                    setweight(to_tsvector('english', coalesce(content, '')), 'B')
                ) STORED
            )", connection);
        await tableCommand.ExecuteNonQueryAsync(cancellationToken);

        await using var indexCommand = new NpgsqlCommand("CREATE INDEX IF NOT EXISTS ix_search_documents_tsv ON search.documents USING GIN (tsv)", connection);
        await indexCommand.ExecuteNonQueryAsync(cancellationToken);

        await using var sugCommand = new NpgsqlCommand(@"
            CREATE TABLE IF NOT EXISTS search.search_suggestions (
                id uuid PRIMARY KEY,
                text varchar(256),
                type varchar(32),
                weight double precision,
                index_id uuid,
                is_deleted boolean
            )", connection);
        await sugCommand.ExecuteNonQueryAsync(cancellationToken);
    }

    public async Task IndexDocumentAsync(SearchDocument document, CancellationToken cancellationToken)
    {
        await using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        await using var command = new NpgsqlCommand(@"
            INSERT INTO search.documents (
                id, external_id, index_id, source_type, title, content, url, image_url,
                author_id, author_name, language, status, is_featured, score, metadata,
                indexed_at, published_at, expires_at, permission_scope, required_roles, allowed_users,
                created_at, updated_at, is_deleted
            ) VALUES (
                @Id, @ExternalId, @IndexId, @SourceType, @Title, @Content, @Url, @ImageUrl,
                @AuthorId, @AuthorName, @Language, @Status, @IsFeatured, @Score, @Metadata,
                @IndexedAt, @PublishedAt, @ExpiresAt, @PermissionScope, @RequiredRoles, @AllowedUsers,
                @CreatedAt, @UpdatedAt, @IsDeleted
            )
            ON CONFLICT (id) DO UPDATE SET
                external_id = EXCLUDED.external_id,
                index_id = EXCLUDED.index_id,
                source_type = EXCLUDED.source_type,
                title = EXCLUDED.title,
                content = EXCLUDED.content,
                url = EXCLUDED.url,
                image_url = EXCLUDED.image_url,
                author_id = EXCLUDED.author_id,
                author_name = EXCLUDED.author_name,
                language = EXCLUDED.language,
                status = EXCLUDED.status,
                is_featured = EXCLUDED.is_featured,
                score = EXCLUDED.score,
                metadata = EXCLUDED.metadata,
                indexed_at = EXCLUDED.indexed_at,
                published_at = EXCLUDED.published_at,
                expires_at = EXCLUDED.expires_at,
                permission_scope = EXCLUDED.permission_scope,
                required_roles = EXCLUDED.required_roles,
                allowed_users = EXCLUDED.allowed_users,
                updated_at = EXCLUDED.updated_at,
                is_deleted = EXCLUDED.is_deleted", connection);

        command.Parameters.AddWithValue("Id", document.Id);
        command.Parameters.AddWithValue("ExternalId", (object?)document.ExternalId ?? DBNull.Value);
        command.Parameters.AddWithValue("IndexId", document.IndexId);
        command.Parameters.AddWithValue("SourceType", document.SourceType.ToString());
        command.Parameters.AddWithValue("Title", (object?)document.Title ?? DBNull.Value);
        command.Parameters.AddWithValue("Content", (object?)document.Content ?? DBNull.Value);
        command.Parameters.AddWithValue("Url", (object?)document.Url ?? DBNull.Value);
        command.Parameters.AddWithValue("ImageUrl", (object?)document.ImageUrl ?? DBNull.Value);
        command.Parameters.AddWithValue("AuthorId", (object?)document.AuthorId ?? DBNull.Value);
        command.Parameters.AddWithValue("AuthorName", (object?)document.AuthorName ?? DBNull.Value);
        command.Parameters.AddWithValue("Language", (object?)document.Language ?? DBNull.Value);
        command.Parameters.AddWithValue("Status", document.Status.ToString());
        command.Parameters.AddWithValue("IsFeatured", document.IsFeatured);
        command.Parameters.AddWithValue("Score", document.Score.Value);
        command.Parameters.AddWithValue("Metadata", (object?)document.Metadata ?? DBNull.Value);
        command.Parameters.AddWithValue("IndexedAt", document.IndexedAt);
        command.Parameters.AddWithValue("PublishedAt", (object?)document.PublishedAt ?? DBNull.Value);
        command.Parameters.AddWithValue("ExpiresAt", (object?)document.ExpiresAt ?? DBNull.Value);
        command.Parameters.AddWithValue("PermissionScope", document.PermissionScope.ToString());
        command.Parameters.AddWithValue("RequiredRoles", (object?)document.RequiredRoles ?? DBNull.Value);
        command.Parameters.AddWithValue("AllowedUsers", (object?)document.AllowedUsers ?? DBNull.Value);
        command.Parameters.AddWithValue("CreatedAt", document.CreatedAt);
        command.Parameters.AddWithValue("UpdatedAt", document.UpdatedAt);
        command.Parameters.AddWithValue("IsDeleted", document.IsDeleted);

        await command.ExecuteNonQueryAsync(cancellationToken);
    }

    public async Task DeleteDocumentAsync(string externalId, string documentType, CancellationToken cancellationToken)
    {
        await using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        await using var command = new NpgsqlCommand(@"
            UPDATE search.documents
            SET is_deleted = true, updated_at = NOW()
            WHERE external_id = @ExternalId
              AND source_type = @SourceType
              AND is_deleted = false", connection);

        command.Parameters.AddWithValue("ExternalId", externalId);
        command.Parameters.AddWithValue("SourceType", documentType);

        await command.ExecuteNonQueryAsync(cancellationToken);
    }

    public async Task RebuildIndexAsync(SearchIndex index, CancellationToken cancellationToken)
    {
        await InitializeIndexAsync(index, cancellationToken);
    }

    public async Task<ProviderSearchResult> SearchAsync(ProviderSearchQuery query, CancellationToken cancellationToken)
    {
        var stopwatch = Stopwatch.StartNew();

        var whereConditions = new List<string>();
        var parameters = new List<NpgsqlParameter>();

        if (!string.IsNullOrWhiteSpace(query.Query))
        {
            whereConditions.Add("tsv @@ websearch_to_tsquery('english', @Query)");
            parameters.Add(new NpgsqlParameter("Query", query.Query));
        }

        whereConditions.Add("status = 'Published'");
        whereConditions.Add("is_deleted = false");

        foreach (var filter in query.Filters)
        {
            if (filter.Operator == "IN")
            {
                var values = filter.Value.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
                var paramName = $"p_{filter.Field}_{Guid.NewGuid():N}";
                var placeholders = string.Join(", ", values.Select((_, i) => $"@{paramName}_{i}"));
                whereConditions.Add($"{filter.Field} IN ({placeholders})");
                for (var i = 0; i < values.Length; i++)
                {
                    parameters.Add(new NpgsqlParameter($"{paramName}_{i}", values[i]));
                }
            }
            else
            {
                var paramName = $"p_{filter.Field}_{Guid.NewGuid():N}";
                whereConditions.Add($"{filter.Field} = @{paramName}");
                parameters.Add(new NpgsqlParameter(paramName, filter.Value));
            }
        }

        var whereClause = "WHERE " + string.Join(" AND ", whereConditions);

        var sortClause = "ORDER BY score DESC, indexed_at DESC";
        if (query.Sort is { Count: > 0 })
        {
            var sorts = new List<string>();
            foreach (var sort in query.Sort)
            {
                var dir = sort.Direction == SortDirection.Asc ? "ASC" : "DESC";
                sorts.Add($"{sort.Field} {dir}");
            }

            sorts.Add("score DESC");
            sorts.Add("indexed_at DESC");
            sortClause = "ORDER BY " + string.Join(", ", sorts);
        }

        var offset = query.Pagination.Offset;
        var pageSize = query.Pagination.PageSize;

        await using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        var countSql = $"SELECT COUNT(*) FROM search.documents {whereClause}";
        await using var countCommand = new NpgsqlCommand(countSql, connection);
        countCommand.Parameters.AddRange(parameters.ToArray());
        var total = Convert.ToInt32(await countCommand.ExecuteScalarAsync(cancellationToken));

        var selectColumns = "id, external_id, source_type, title, content, url, image_url, author_name, score";

        var highlightSelect = query.IncludeHighlights && !string.IsNullOrWhiteSpace(query.Query)
            ? $", ts_headline('english', content, websearch_to_tsquery('english', @Query), 'StartTag={query.HighlightPreTag}, StopTag={query.HighlightPostTag}') AS headline"
            : ", NULL AS headline";

        var sql = $"""
            SELECT {selectColumns}{highlightSelect}
            FROM search.documents
            {whereClause}
            {sortClause}
            LIMIT @PageSize OFFSET @Offset
            """;

        await using var searchCommand = new NpgsqlCommand(sql, connection);
        searchCommand.Parameters.AddRange(parameters.ToArray());
        searchCommand.Parameters.AddWithValue("PageSize", pageSize);
        searchCommand.Parameters.AddWithValue("Offset", offset);

        if (!string.IsNullOrWhiteSpace(query.Query))
        {
            searchCommand.Parameters.AddWithValue("Query", query.Query);
        }

        var items = new List<ProviderSearchResultItem>();
        await using (var reader = await searchCommand.ExecuteReaderAsync(cancellationToken))
        {
            while (await reader.ReadAsync(cancellationToken))
            {
                var headline = reader.IsDBNull(reader.GetOrdinal("headline")) ? null : reader.GetString(reader.GetOrdinal("headline"));
                var highlights = new List<string>();
                if (!string.IsNullOrEmpty(headline))
                {
                    highlights.Add(headline);
                }

                items.Add(new ProviderSearchResultItem(
                    reader.GetGuid(reader.GetOrdinal("id")),
                    reader.GetString(reader.GetOrdinal("external_id")),
                    Enum.Parse<IndexSourceType>(reader.GetString(reader.GetOrdinal("source_type"))),
                    reader.GetString(reader.GetOrdinal("title")),
                    reader.GetString(reader.GetOrdinal("content")),
                    reader.IsDBNull(reader.GetOrdinal("url")) ? null : reader.GetString(reader.GetOrdinal("url")),
                    reader.IsDBNull(reader.GetOrdinal("image_url")) ? null : reader.GetString(reader.GetOrdinal("image_url")),
                    reader.IsDBNull(reader.GetOrdinal("author_name")) ? null : reader.GetString(reader.GetOrdinal("author_name")),
                    reader.GetDouble(reader.GetOrdinal("score")),
                    highlights));
            }
        }

        var result = new ProviderSearchResult
        {
            Total = total,
            Page = query.Pagination.Page,
            PageSize = pageSize,
            Items = items,
            TookMs = stopwatch.ElapsedMilliseconds
        };

        if (query.IncludeFacets)
        {
            result.Facets = await GetFacetsAsync(query, cancellationToken);
        }

        if (query.IncludeSuggestions && !string.IsNullOrWhiteSpace(query.Query))
        {
            result.Suggestions = await GetSuggestionsAsync(query.Query, query.UserRoles.FirstOrDefault(), cancellationToken);
        }

        stopwatch.Stop();
        result.TookMs = stopwatch.ElapsedMilliseconds;

        return result;
    }

    public async Task<IReadOnlyList<ProviderSearchSuggestion>> GetSuggestionsAsync(string query, string? documentType, CancellationToken cancellationToken)
    {
        await using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        var sql = @"SELECT text, type, weight FROM search.search_suggestions WHERE text ILIKE @Query AND is_deleted = false ORDER BY weight DESC LIMIT 8";
        await using var command = new NpgsqlCommand(sql, connection);
        command.Parameters.AddWithValue("Query", $"%{query}%");

        var suggestions = new List<ProviderSearchSuggestion>();
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            suggestions.Add(new ProviderSearchSuggestion(
                reader.GetString(reader.GetOrdinal("text")),
                reader.GetString(reader.GetOrdinal("type")),
                reader.GetDouble(reader.GetOrdinal("weight"))));
        }

        return suggestions;
    }

    public async Task<IReadOnlyList<ProviderSearchFacet>> GetFacetsAsync(ProviderSearchQuery query, CancellationToken cancellationToken)
    {
        await using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);

        var whereConditions = new List<string> { "status = 'Published'", "is_deleted = false" };
        var parameters = new List<NpgsqlParameter>();

        if (!string.IsNullOrWhiteSpace(query.Query))
        {
            whereConditions.Add("tsv @@ websearch_to_tsquery('english', @Query)");
            parameters.Add(new NpgsqlParameter("Query", query.Query));
        }

        foreach (var filter in query.Filters)
        {
            var paramName = $"fp_{filter.Field}_{Guid.NewGuid():N}";
            whereConditions.Add($"{filter.Field} = @{paramName}");
            parameters.Add(new NpgsqlParameter(paramName, filter.Value));
        }

        var whereClause = "WHERE " + string.Join(" AND ", whereConditions);
        var sql = $"""
            SELECT source_type, COUNT(*) AS cnt FROM search.documents {whereClause} GROUP BY source_type
            UNION ALL
            SELECT language, COUNT(*) AS cnt FROM search.documents {whereClause} GROUP BY language
            UNION ALL
            SELECT author_name, COUNT(*) AS cnt FROM search.documents {whereClause} AND author_name IS NOT NULL GROUP BY author_name
            """;

        await using var command = new NpgsqlCommand(sql, connection);
        command.Parameters.AddRange(parameters.ToArray());
        if (!string.IsNullOrWhiteSpace(query.Query))
        {
            command.Parameters.AddWithValue("Query", query.Query);
        }

        var facets = new List<ProviderSearchFacet>();
        var sourceTypeValues = new List<ProviderFacetValue>();
        var languageValues = new List<ProviderFacetValue>();
        var authorNameValues = new List<ProviderFacetValue>();

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            var field = reader.GetString(reader.GetOrdinal("source_type"));
            var count = reader.GetInt32(reader.GetOrdinal("cnt"));
            sourceTypeValues.Add(new ProviderFacetValue(field, count, false));
        }

        // Need separate queries for other facets since UNION ALL with different columns doesn't work well
        // Actually the query above is wrong. Let me fix this with separate queries.

        await reader.CloseAsync();

        var facetsResult = new List<ProviderSearchFacet>();

        var sourceSql = $"SELECT source_type, COUNT(*) AS cnt FROM search.documents {whereClause} GROUP BY source_type";
        await using var sourceCommand = new NpgsqlCommand(sourceSql, connection);
        sourceCommand.Parameters.AddRange(parameters.ToArray());
        if (!string.IsNullOrWhiteSpace(query.Query))
        {
            sourceCommand.Parameters.AddWithValue("Query", query.Query);
        }

        var sourceValues = new List<ProviderFacetValue>();
        await using var sourceReader = await sourceCommand.ExecuteReaderAsync(cancellationToken);
        while (await sourceReader.ReadAsync(cancellationToken))
        {
            sourceValues.Add(new ProviderFacetValue(sourceReader.GetString(0), sourceReader.GetInt32(1), false));
        }
        await sourceReader.CloseAsync();

        var langSql = $"SELECT language, COUNT(*) AS cnt FROM search.documents {whereClause} GROUP BY language";
        await using var langCommand = new NpgsqlCommand(langSql, connection);
        langCommand.Parameters.AddRange(parameters.ToArray());
        if (!string.IsNullOrWhiteSpace(query.Query))
        {
            langCommand.Parameters.AddWithValue("Query", query.Query);
        }

        var langValues = new List<ProviderFacetValue>();
        await using var langReader = await langCommand.ExecuteReaderAsync(cancellationToken);
        while (await langReader.ReadAsync(cancellationToken))
        {
            langValues.Add(new ProviderFacetValue(langReader.GetString(0), langReader.GetInt32(1), false));
        }
        await langReader.CloseAsync();

        var authorSql = $"SELECT author_name, COUNT(*) AS cnt FROM search.documents {whereClause} AND author_name IS NOT NULL GROUP BY author_name";
        await using var authorCommand = new NpgsqlCommand(authorSql, connection);
        authorCommand.Parameters.AddRange(parameters.ToArray());
        if (!string.IsNullOrWhiteSpace(query.Query))
        {
            authorCommand.Parameters.AddWithValue("Query", query.Query);
        }

        var authorValues = new List<ProviderFacetValue>();
        await using var authorReader = await authorCommand.ExecuteReaderAsync(cancellationToken);
        while (await authorReader.ReadAsync(cancellationToken))
        {
            authorValues.Add(new ProviderFacetValue(authorReader.GetString(0), authorReader.GetInt32(1), false));
        }
        await authorReader.CloseAsync();

        facetsResult.Add(new ProviderSearchFacet("source_type", FacetType.Terms, sourceValues));
        facetsResult.Add(new ProviderSearchFacet("language", FacetType.Terms, langValues));
        facetsResult.Add(new ProviderSearchFacet("author_name", FacetType.Terms, authorValues));

        return facetsResult;
    }

    public async Task<bool> HealthCheckAsync(CancellationToken cancellationToken)
    {
        try
        {
            await using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync(cancellationToken);
            await using var command = new NpgsqlCommand("SELECT 1", connection);
            await command.ExecuteScalarAsync(cancellationToken);
            return true;
        }
        catch
        {
            return false;
        }
    }
}

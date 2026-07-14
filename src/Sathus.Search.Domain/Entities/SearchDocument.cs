using Sathus.Search.Domain.Enums;
using Sathus.Search.Domain.Events;
using Sathus.Search.Domain.Exceptions;
using Sathus.Search.Domain.ValueObjects;

namespace Sathus.Search.Domain.Entities;

public sealed class SearchDocument : AggregateRoot
{
    public Guid IndexId { get; private set; }
    public string ExternalId { get; private set; } = string.Empty;
    public IndexSourceType SourceType { get; private set; }
    public DocumentStatus Status { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string Content { get; private set; } = string.Empty;
    public string? Url { get; private set; }
    public string? ImageUrl { get; private set; }
    public Guid? AuthorId { get; private set; }
    public string? AuthorName { get; private set; }
    public string Language { get; private set; } = "en";
    public bool IsFeatured { get; private set; }
    public SearchScore Score { get; private set; } = SearchScore.Zero;
    public string Metadata { get; private set; } = "{}";
    public DateTime IndexedAt { get; private set; }
    public DateTime? PublishedAt { get; private set; }
    public DateTime? ExpiresAt { get; private set; }
    public PermissionScope PermissionScope { get; private set; } = PermissionScope.Public;
    public string? RequiredRoles { get; private set; }
    public string? AllowedUsers { get; private set; }
    public ICollection<SearchField> Fields { get; } = new List<SearchField>();
    public SearchDocumentId DocumentId => new(Id);

    private SearchDocument() { }

    public static SearchDocument Create(Guid indexId, string externalId, IndexSourceType sourceType, string title, string content, string? url = null, string? imageUrl = null, Guid? authorId = null, string? authorName = null, string language = "en", PermissionScope permissionScope = PermissionScope.Public)
    {
        if (indexId == Guid.Empty) throw new ArgumentException("IndexId is required.", nameof(indexId));
        if (string.IsNullOrWhiteSpace(externalId)) throw new ArgumentException("ExternalId is required.", nameof(externalId));
        if (string.IsNullOrWhiteSpace(title)) throw new ArgumentException("Title is required.", nameof(title));
        if (content is null) throw new ArgumentNullException(nameof(content));

        return new SearchDocument
        {
            Id = Guid.NewGuid(),
            IndexId = indexId,
            ExternalId = externalId.Trim(),
            SourceType = sourceType,
            Status = DocumentStatus.Published,
            Title = title.Trim(),
            Content = content,
            Url = url,
            ImageUrl = imageUrl,
            AuthorId = authorId,
            AuthorName = authorName,
            Language = string.IsNullOrWhiteSpace(language) ? "en" : language.Trim().ToLowerInvariant(),
            IsFeatured = false,
            Score = SearchScore.Zero,
            IndexedAt = DateTime.UtcNow,
            PermissionScope = permissionScope,
            RequiredRoles = null,
            AllowedUsers = null
        };
    }

    public void Update(string title, string content, string? url, string? imageUrl, Guid? updatedBy)
    {
        Title = string.IsNullOrWhiteSpace(title) ? Title : title.Trim();
        Content = content ?? Content;
        Url = url;
        ImageUrl = imageUrl;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
        IndexedAt = DateTime.UtcNow;
        AddDomainEvent(new SearchDocumentUpdatedEvent(Id, ExternalId, SourceType));
    }

    public void Publish(DateTime publishedAt, Guid? updatedBy)
    {
        Status = DocumentStatus.Published;
        PublishedAt = publishedAt;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
        AddDomainEvent(new SearchDocumentStatusChangedEvent(Id, ExternalId, Status));
    }

    public void Archive(Guid? updatedBy)
    {
        Status = DocumentStatus.Archived;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
        AddDomainEvent(new SearchDocumentStatusChangedEvent(Id, ExternalId, Status));
    }

    public void Expire(Guid? updatedBy)
    {
        Status = DocumentStatus.Expired;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
        AddDomainEvent(new SearchDocumentStatusChangedEvent(Id, ExternalId, Status));
    }

    public void SetPermissionScope(PermissionScope scope, string? roles = null, string? users = null, Guid? updatedBy = null)
    {
        PermissionScope = scope;
        RequiredRoles = roles;
        AllowedUsers = users;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    public void SetScore(double score, Guid? updatedBy)
    {
        Score = SearchScore.Create(score);
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    public void SetMetadata(string metadata, Guid? updatedBy)
    {
        Metadata = metadata;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }
}

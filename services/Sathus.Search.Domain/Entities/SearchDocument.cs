using Sathus.Search.Domain.Enums;
using Sathus.Search.Domain.Events;
using Sathus.Search.Domain.ValueObjects;
using Sathus.SharedKernel.Entities;

namespace Sathus.Search.Domain.Entities;

public sealed class SearchDocument : AggregateRoot
{
    public Guid IndexId { get; private set; }
    public string ExternalId { get; private set; }
    public IndexSourceType SourceType { get; private set; }
    public string Title { get; private set; }
    public string Content { get; private set; }
    public string? Url { get; private set; }
    public string? ImageUrl { get; private set; }
    public Guid? AuthorId { get; private set; }
    public string? AuthorName { get; private set; }
    public string Language { get; private set; }
    public DocumentStatus Status { get; private set; }
    public string? Metadata { get; private set; }
    public bool IsFeatured { get; private set; }
    public SearchScore Score { get; private set; }
    public DateTime IndexedAt { get; private set; }
    public DateTime? PublishedAt { get; private set; }
    public DateTime? ExpiresAt { get; private set; }
    public PermissionScope PermissionScope { get; private set; }
    public string? RequiredRoles { get; private set; }
    public string? AllowedUsers { get; private set; }

    public SearchDocument(Guid id, Guid indexId, string externalId, IndexSourceType sourceType, string title, string content, string? url, string? imageUrl, Guid? authorId, string? authorName, string language, PermissionScope permissionScope) : base(id)
    {
        IndexId = indexId;
        ExternalId = string.IsNullOrWhiteSpace(externalId) ? throw new ArgumentException("ExternalId is required.", nameof(externalId)) : externalId;
        SourceType = sourceType;
        Title = string.IsNullOrWhiteSpace(title) ? throw new ArgumentException("Title is required.", nameof(title)) : title;
        Content = string.IsNullOrWhiteSpace(content) ? throw new ArgumentException("Content is required.", nameof(content)) : content;
        Url = url;
        ImageUrl = imageUrl;
        AuthorId = authorId;
        AuthorName = authorName;
        Language = string.IsNullOrWhiteSpace(language) ? "en" : language;
        Status = DocumentStatus.Draft;
        Metadata = string.Empty;
        IsFeatured = false;
        Score = new SearchScore(0);
        IndexedAt = DateTime.UtcNow;
        PermissionScope = permissionScope;
        RequiredRoles = null;
        AllowedUsers = null;
    }

    public SearchDocument Update(string title, string content, string? url, string? imageUrl, Guid? actorId)
    {
        Title = string.IsNullOrWhiteSpace(title) ? Title : title;
        Content = string.IsNullOrWhiteSpace(content) ? Content : content;
        if (!string.IsNullOrEmpty(url)) Url = url;
        if (!string.IsNullOrEmpty(imageUrl)) ImageUrl = imageUrl;
        IndexedAt = DateTime.UtcNow;
        SetUpdateAudit(actorId, DateTime.UtcNow);
        return this;
    }

    public SearchDocument SetMetadata(string metadata, Guid? actorId)
    {
        Metadata = metadata;
        SetUpdateAudit(actorId, DateTime.UtcNow);
        return this;
    }

    public SearchDocument SetScore(double score, Guid? actorId)
    {
        Score = SearchScore.Create(score);
        SetUpdateAudit(actorId, DateTime.UtcNow);
        return this;
    }

    public SearchDocument Publish(DateTime publishedAt, Guid? actorId)
    {
        Status = DocumentStatus.Published;
        PublishedAt = publishedAt;
        SetUpdateAudit(actorId, DateTime.UtcNow);
        return this;
    }

    public SearchDocument Expire(Guid? actorId)
    {
        Status = DocumentStatus.Expired;
        SetUpdateAudit(actorId, DateTime.UtcNow);
        return this;
    }

    public SearchDocument SetPermissionScope(PermissionScope scope, string? requiredRoles, string? allowedUsers, Guid? actorId)
    {
        PermissionScope = scope;
        RequiredRoles = requiredRoles;
        AllowedUsers = allowedUsers;
        SetUpdateAudit(actorId, DateTime.UtcNow);
        return this;
    }

    public SearchDocument Delete(Guid? actorId)
    {
        MarkDeleted(actorId, DateTime.UtcNow);
        AddDomainEvent(new SearchDocumentDeletedEvent(Id, IndexId, ExternalId, SourceType));
        return this;
    }

    public static SearchDocument Create(Guid indexId, string externalId, IndexSourceType sourceType, string title, string content, string? url = null)
        => new(Guid.NewGuid(), indexId, externalId, sourceType, title, content, url, null, null, null, "en", PermissionScope.Public);

    public static SearchDocument Create(Guid indexId, string externalId, IndexSourceType sourceType, string title, string content, string? url = null, string? imageUrl = null)
        => new(Guid.NewGuid(), indexId, externalId, sourceType, title, content, url, imageUrl, null, null, "en", PermissionScope.Public);

    public static SearchDocument Create(Guid indexId, string externalId, IndexSourceType sourceType, string title, string content, string? url, string? imageUrl, Guid? authorId, string? authorName, string language, PermissionScope permissionScope)
        => new(Guid.NewGuid(), indexId, externalId, sourceType, title, content, url, imageUrl, authorId, authorName, language, permissionScope);

    private SearchDocument() { }
}

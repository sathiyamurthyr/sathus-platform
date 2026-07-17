using MediatR;
using Sathus.Search.Domain.Entities;
using Sathus.Search.Domain.Enums;

namespace Sathus.Search.Application.Commands.IndexDocument;

public sealed record IndexDocumentCommand(
    Guid IndexId,
    string ExternalId,
    IndexSourceType SourceType,
    string Title,
    string Content,
    string? Url = null,
    string? ImageUrl = null,
    Guid? AuthorId = null,
    string? AuthorName = null,
    string Language = "en",
    string? Metadata = null,
    bool IsFeatured = false,
    DateTime? PublishedAt = null,
    DateTime? ExpiresAt = null,
    PermissionScope PermissionScope = PermissionScope.Public,
    string? RequiredRoles = null,
    string? AllowedUsers = null,
    Guid? ActorId = null)
    : IRequest<SearchDocumentResponse>;

public sealed class IndexDocumentCommandHandler : IRequestHandler<IndexDocumentCommand, SearchDocumentResponse>
{
    private readonly ISearchRepository _repository;

    public IndexDocumentCommandHandler(ISearchRepository repository) => _repository = repository;

    public async Task<SearchDocumentResponse> Handle(IndexDocumentCommand request, CancellationToken cancellationToken)
    {
        var existing = await _repository.GetByExternalIdAsync(request.IndexId, request.ExternalId, cancellationToken);
        SearchDocument document;

        if (existing is not null)
        {
            document = existing;
            document.Update(request.Title, request.Content, request.Url, request.ImageUrl, request.ActorId);
        }
        else
        {
            document = SearchDocument.Create(request.IndexId, request.ExternalId, request.SourceType, request.Title, request.Content, request.Url, request.ImageUrl, request.AuthorId, request.AuthorName, request.Language, request.PermissionScope);
        }

        if (!string.IsNullOrEmpty(request.Metadata)) document.SetMetadata(request.Metadata, request.ActorId);
        if (request.IsFeatured) document.SetScore(10.0, request.ActorId);
        if (request.PublishedAt.HasValue) document.Publish(request.PublishedAt.Value, request.ActorId);
        if (request.ExpiresAt.HasValue) document.Expire(request.ActorId);
        if (!string.IsNullOrEmpty(request.RequiredRoles) || !string.IsNullOrEmpty(request.AllowedUsers)) document.SetPermissionScope(request.PermissionScope, request.RequiredRoles, request.AllowedUsers, request.ActorId);

        if (existing is null) await _repository.AddAsync(document, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);

        return new SearchDocumentResponse(document.Id, document.ExternalId, document.SourceType, document.Title, document.Content, document.Url, document.ImageUrl, document.AuthorName, document.Language, document.Status.ToString(), document.IsFeatured, document.Score.Value, document.IndexedAt, document.PublishedAt, document.PermissionScope.ToString());
    }
}

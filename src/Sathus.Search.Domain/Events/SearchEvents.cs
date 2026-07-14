using Sathus.Search.Domain.Enums;
using Sathus.SharedKernel.Events;

namespace Sathus.Search.Domain.Events;

public sealed record SearchDocumentIndexedEvent(Guid DocumentId, string ExternalId, IndexSourceType SourceType) : IDomainEvent;
public sealed record SearchDocumentUpdatedEvent(Guid DocumentId, string ExternalId, IndexSourceType SourceType) : IDomainEvent;
public sealed record SearchDocumentDeletedEvent(Guid DocumentId, string ExternalId, IndexSourceType SourceType) : IDomainEvent;
public sealed record SearchDocumentStatusChangedEvent(Guid DocumentId, string ExternalId, DocumentStatus Status) : IDomainEvent;
public sealed record SearchIndexCreatedEvent(Guid IndexId, string Code) : IDomainEvent;
public sealed record SearchIndexUpdatedEvent(Guid IndexId, string Change) : IDomainEvent;
public sealed record SearchIndexRebuiltEvent(Guid IndexId, string Code) : IDomainEvent;
public sealed record SearchFieldAddedEvent(Guid IndexId, Guid FieldId, string FieldName) : IDomainEvent;
public sealed record SearchSynonymUpdatedEvent(Guid IndexId, Guid SynonymId) : IDomainEvent;
public sealed record SearchRankingUpdatedEvent(Guid IndexId, Guid RankingId) : IDomainEvent;

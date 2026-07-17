using MediatR;
using Sathus.SharedKernel.Events;

namespace Sathus.Search.Domain.Events;

public sealed record SearchDocumentIndexedEvent(Guid DocumentId, Guid IndexId, string ExternalId, IndexSourceType SourceType) : IDomainEvent, INotification;

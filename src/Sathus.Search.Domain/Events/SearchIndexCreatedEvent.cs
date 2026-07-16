using MediatR;
using Sathus.SharedKernel.Events;

namespace Sathus.Search.Domain.Events;

public sealed record SearchIndexCreatedEvent(Guid IndexId, string Name, string Code) : IDomainEvent, INotification;

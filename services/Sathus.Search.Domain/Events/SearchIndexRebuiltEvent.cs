using MediatR;
using Sathus.SharedKernel.Events;

namespace Sathus.Search.Domain.Events;

public sealed record SearchIndexRebuiltEvent(Guid IndexId, int DocumentCount) : IDomainEvent, INotification;

using Sathus.Storage.Domain.Interfaces;

namespace Sathus.Storage.Domain.Events;

public sealed record StorageObjectDeleted(string Key, string Provider) : IDomainEvent;

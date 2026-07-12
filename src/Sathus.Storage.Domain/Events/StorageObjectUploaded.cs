using Sathus.Storage.Domain.Interfaces;

namespace Sathus.Storage.Domain.Events;

public sealed record StorageObjectUploaded(string Key, string Provider, long? Size, string? ContentType) : IDomainEvent;

using Sathus.Storage.Domain.Enums;
using Sathus.Storage.Domain.Results;

namespace Sathus.Storage.Application.DTOs;

public sealed record ProviderConfigResponse(
    string Name,
    StorageProviderType Type,
    bool IsDefault,
    StorageLocation? Location,
    IReadOnlyDictionary<string, string> Settings);

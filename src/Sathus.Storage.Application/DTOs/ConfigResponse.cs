namespace Sathus.Storage.Application.DTOs;

public sealed record ConfigResponse(
    string DefaultProvider,
    IReadOnlyList<ProviderConfigResponse> Providers);

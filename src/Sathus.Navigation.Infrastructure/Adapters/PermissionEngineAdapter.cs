using System.Net.Http.Json;
using Sathus.Navigation.Application.Interfaces;
using Sathus.Navigation.Domain.Enums;

namespace Sathus.Navigation.Infrastructure.Adapters;

public sealed class PermissionEngineAdapter(HttpClient http) : IPermissionCatalog
{
    private const string BasePath = "/api/v1/permissions";

    public async Task<bool> ExistsAsync(string permission, CancellationToken cancellationToken = default)
    {
        try
        {
            var result = await http.GetAsync($"{BasePath}?q={Uri.EscapeDataString(permission)}&limit=1", cancellationToken);
            return result.IsSuccessStatusCode;
        }
        catch
        {
            return true;
        }
    }
}

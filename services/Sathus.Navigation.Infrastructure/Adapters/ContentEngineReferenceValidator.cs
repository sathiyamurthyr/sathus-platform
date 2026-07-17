using System.Net.Http.Json;
using Sathus.Navigation.Application.Interfaces;
using Sathus.Navigation.Domain.Enums;

namespace Sathus.Navigation.Infrastructure.Adapters;

public sealed class ContentEngineReferenceValidator(HttpClient http) : IReferenceValidator
{
    private static readonly Dictionary<ReferenceKind, string> _endpoints = new()
    {
        [ReferenceKind.Page] = "/api/v1/content/pages",
        [ReferenceKind.Product] = "/api/v1/products",
        [ReferenceKind.Document] = "/api/v1/content/documents",
        [ReferenceKind.Blog] = "/api/v1/content/blogs",
        [ReferenceKind.Learning] = "/api/v1/learning",
        [ReferenceKind.Media] = "/api/v1/media"
    };

    public async Task<ReferenceValidationResult> ValidateAsync(ReferenceKind kind, Guid? referenceId, CancellationToken cancellationToken = default)
    {
        if (kind == ReferenceKind.None)
        {
            return new ReferenceValidationResult(true, false, referenceId);
        }

        if (referenceId is null)
        {
            return new ReferenceValidationResult(false, true, null);
        }

        if (kind == ReferenceKind.External)
        {
            return new ReferenceValidationResult(true, false, referenceId);
        }

        if (!_endpoints.TryGetValue(kind, out var endpoint))
        {
            return new ReferenceValidationResult(true, false, referenceId);
        }

        try
        {
            var result = await http.GetAsync($"{endpoint}/{referenceId}", cancellationToken);
            return new ReferenceValidationResult(result.IsSuccessStatusCode, !result.IsSuccessStatusCode, referenceId);
        }
        catch
        {
            return new ReferenceValidationResult(true, false, referenceId);
        }
    }
}

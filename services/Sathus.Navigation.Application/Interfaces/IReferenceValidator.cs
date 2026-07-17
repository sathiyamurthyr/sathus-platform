using Sathus.Navigation.Domain.Enums;

namespace Sathus.Navigation.Application.Interfaces;

/// <summary>
/// Result of validating an external content reference for broken-reference detection.
/// </summary>
public sealed record ReferenceValidationResult(bool Exists, bool IsBroken, Guid? ResolvedId);

/// <summary>
/// Integration port to the Content Engine / DAM for reference existence checks. Implemented by
/// an HTTP adapter that degrades gracefully when the upstream service is unavailable.
/// </summary>
public interface IReferenceValidator
{
    Task<ReferenceValidationResult> ValidateAsync(ReferenceKind kind, Guid? referenceId, CancellationToken cancellationToken = default);
}

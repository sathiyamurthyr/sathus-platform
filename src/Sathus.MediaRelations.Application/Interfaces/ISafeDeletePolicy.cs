using Sathus.MediaRelations.Application.DTOs;

namespace Sathus.MediaRelations.Application.Interfaces;

/// <summary>
/// Encapsulates the safe-delete decision for an asset. Evaluates current usage, historical
/// usage, dependencies, active references and published/scheduled content before allowing
/// deletion, honouring an optional force-delete policy.
/// </summary>
public interface ISafeDeletePolicy
{
    Task<SafeDeleteEvaluation> EvaluateAsync(Guid assetId, bool forceDelete = false, CancellationToken cancellationToken = default);
}

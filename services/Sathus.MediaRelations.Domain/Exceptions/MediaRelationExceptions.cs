using Sathus.SharedKernel.Exceptions;

namespace Sathus.MediaRelations.Domain.Exceptions;

public sealed class MediaReferenceNotFoundException : AppException
{
    public Guid ReferenceId { get; }

    public MediaReferenceNotFoundException(Guid referenceId)
        : base($"Media reference '{referenceId}' was not found.")
    {
        ReferenceId = referenceId;
    }
}

public sealed class MediaUsageStatisticsNotFoundException : AppException
{
    public Guid AssetId { get; }

    public MediaUsageStatisticsNotFoundException(Guid assetId)
        : base($"Usage statistics for asset '{assetId}' were not found.")
    {
        AssetId = assetId;
    }
}

public sealed class InvalidReferenceStateException : AppException
{
    public InvalidReferenceStateException(string message) : base(message)
    {
    }
}

public sealed class DuplicateReferenceException : AppException
{
    public DuplicateReferenceException(Guid assetId, string referenceType, string referenceId, string usageType, string path)
        : base($"A reference already exists for asset '{assetId}' from {referenceType}:{referenceId} as '{usageType}' at '{path}'.")
    {
    }
}

/// <summary>
/// Thrown by the safe-delete policy when an asset cannot be deleted because active
/// references still exist and force-delete is not permitted.
/// </summary>
public sealed class AssetDeletionBlockedException : AppException
{
    public Guid AssetId { get; }
    public IReadOnlyList<string> Reasons { get; }

    public AssetDeletionBlockedException(Guid assetId, IReadOnlyList<string> reasons)
        : base($"Asset '{assetId}' cannot be deleted: {string.Join("; ", reasons)}.")
    {
        AssetId = assetId;
        Reasons = reasons;
    }
}

public sealed class CircularDependencyException : AppException
{
    public CircularDependencyException(string message) : base(message)
    {
    }
}

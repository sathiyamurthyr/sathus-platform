using Sathus.SharedKernel.Exceptions;

namespace Sathus.Processing.Domain.Exceptions;

public sealed class ProcessingJobNotFoundException : AppException
{
    public ProcessingJobNotFoundException(Guid jobId)
        : base($"Processing job '{jobId}' was not found.") { }
}

public sealed class InvalidProcessingStateException : AppException
{
    public InvalidProcessingStateException(string message) : base(message) { }
}

public sealed class AssetProcessingException : AppException
{
    public AssetProcessingException(string message) : base(message) { }

    public AssetProcessingException(string message, Exception inner) : base(message, inner) { }
}

public sealed class UnsupportedAssetException : AppException
{
    public UnsupportedAssetException(string message) : base(message) { }
}

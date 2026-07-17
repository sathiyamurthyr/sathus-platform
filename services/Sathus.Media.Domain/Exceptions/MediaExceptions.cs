using Sathus.SharedKernel.Exceptions;

namespace Sathus.Media.Domain.Exceptions;

public sealed class MediaAssetNotFoundException : AppException
{
    public MediaAssetNotFoundException(Guid assetId)
        : base($"Media asset '{assetId}' was not found.")
    {
        AssetId = assetId;
    }

    public Guid AssetId { get; }
}

public sealed class MediaFolderNotFoundException : AppException
{
    public MediaFolderNotFoundException(Guid folderId)
        : base($"Media folder '{folderId}' was not found.")
    {
        FolderId = folderId;
    }

    public Guid FolderId { get; }
}

public sealed class MediaTagNotFoundException : AppException
{
    public MediaTagNotFoundException(Guid tagId)
        : base($"Media tag '{tagId}' was not found.")
    {
        TagId = tagId;
    }

    public Guid TagId { get; }
}

public sealed class MediaCollectionNotFoundException : AppException
{
    public MediaCollectionNotFoundException(Guid collectionId)
        : base($"Media collection '{collectionId}' was not found.")
    {
        CollectionId = collectionId;
    }

    public Guid CollectionId { get; }
}

public sealed class InvalidMediaStatusTransitionException : AppException
{
    public InvalidMediaStatusTransitionException(string message) : base(message)
    {
    }
}

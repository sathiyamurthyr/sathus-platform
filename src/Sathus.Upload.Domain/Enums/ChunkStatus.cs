namespace Sathus.Upload.Domain.Enums;

public enum ChunkStatus
{
    Pending = 0,
    Uploading = 1,
    Completed = 2,
    Failed = 3,
    Skipped = 4
}

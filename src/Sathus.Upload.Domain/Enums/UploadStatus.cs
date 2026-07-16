namespace Sathus.Upload.Domain.Enums;

public enum UploadStatus
{
    Pending = 0,
    Uploading = 1,
    Paused = 2,
    Completed = 3,
    Failed = 4,
    Cancelled = 5
}

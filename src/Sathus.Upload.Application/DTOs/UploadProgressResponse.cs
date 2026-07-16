namespace Sathus.Upload.Application.DTOs;

public sealed record UploadProgressResponse(
    Guid SessionId,
    string SessionIdentifier,
    double Progress,
    int UploadedChunks,
    int TotalChunks,
    string Status,
    long BytesUploaded,
    long BytesTotal,
    double SpeedBytesPerSecond,
    TimeSpan? EstimatedRemaining)
{
    public static UploadProgressResponse From(UploadSession session, long bytesUploaded, double speed, TimeSpan? remaining) => new(
        session.Id,
        session.SessionId,
        session.Progress,
        session.UploadedChunks,
        session.TotalChunks,
        session.Status.ToString(),
        bytesUploaded,
        session.FileSize.Bytes,
        speed,
        remaining);
}

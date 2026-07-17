namespace Sathus.Storage.Domain.Results;

public sealed record StorageResult(bool Succeeded, string? Error = null, string? ErrorCode = null)
{
    public static StorageResult Success() => new(true);
    public static StorageResult Failure(string error, string? errorCode = null) => new(false, error, errorCode);
}

using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Sathus.Storage.Domain.Enums;
using Sathus.Storage.Domain.Results;

namespace Sathus.Storage.Domain.Interfaces;

public interface IStorageProvider
{
    string ProviderName { get; }
    StorageProviderType ProviderType { get; }
    StorageLocation Location { get; }

    Task<StorageResult> UploadAsync(
        string key,
        Stream data,
        string? contentType = null,
        Dictionary<string, string>? metadata = null,
        CancellationToken cancellationToken = default);

    Task<(Stream Data, StorageResult Result)> DownloadAsync(
        string key,
        CancellationToken cancellationToken = default);

    Task<StorageResult> DeleteAsync(string key, CancellationToken cancellationToken = default);

    Task<StorageResult> CopyAsync(string sourceKey, string destinationKey, CancellationToken cancellationToken = default);

    Task<StorageResult> MoveAsync(string sourceKey, string destinationKey, CancellationToken cancellationToken = default);

    Task<StorageResult> RenameAsync(string key, string newKey, CancellationToken cancellationToken = default);

    Task<bool> ExistsAsync(string key, CancellationToken cancellationToken = default);

    Task<StorageObjectInfo?> GetMetadataAsync(string key, CancellationToken cancellationToken = default);

    Task<SignedUrl> GenerateSignedUrlAsync(
        string key,
        TimeSpan expiration,
        string? httpMethod = null,
        CancellationToken cancellationToken = default);

    string GeneratePublicUrl(string key);

    Task<Stream> GetObjectStreamAsync(string key, CancellationToken cancellationToken = default);

    Task<StorageResult> CreateFolderAsync(string path, CancellationToken cancellationToken = default);

    Task<StorageResult> DeleteFolderAsync(string path, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<StorageObjectInfo>> ListObjectsAsync(string prefix, int maxKeys = 1000, CancellationToken cancellationToken = default);
}

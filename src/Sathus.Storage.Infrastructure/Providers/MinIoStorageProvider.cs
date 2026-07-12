using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Minio;
using Minio.Exceptions;
using Sathus.Storage.Domain.Enums;
using Sathus.Storage.Domain.Exceptions;
using Sathus.Storage.Domain.Interfaces;
using Sathus.Storage.Domain.Results;
using Sathus.Storage.Domain.ValueObjects;
using Sathus.Storage.Infrastructure.Configuration;
using Sathus.Storage.Infrastructure.Security;

namespace Sathus.Storage.Infrastructure.Providers;

public class MinIoStorageProvider : IStorageProvider
{
    private readonly MinioClient _client;
    private readonly MinIoOptions _options;
    private readonly ILogger<MinIoStorageProvider> _logger;
    private readonly StoragePathValidator _pathValidator;
    public string ProviderName { get; }
    public StorageProviderType ProviderType => StorageProviderType.MinIO;
    public StorageLocation Location { get; }

    public MinIoStorageProvider(IOptions<MinIoOptions> options, ILogger<MinIoStorageProvider> logger, StoragePathValidator pathValidator)
    {
        _options = options.Value;
        _logger = logger;
        _pathValidator = pathValidator;
        ProviderName = "minio";

        _client = new MinioClient()
            .WithEndpoint(_options.Endpoint)
            .WithCredentials(_options.AccessKey, _options.SecretKey);

        if (_options.UseSsl)
            _client.WithSSL();

        if (!string.IsNullOrWhiteSpace(_options.Region))
            _client.WithRegion(_options.Region);

        Location = new StorageLocation(StorageProviderType.MinIO, null, null, new StorageEndpoint(new Uri($"{( _options.UseSsl ? "https" : "http")}://{_options.Endpoint}")), StorageRegion.Create(_options.Region ?? string.Empty));
    }

    public async Task<StorageResult> UploadAsync(string key, Stream data, string? contentType = null, Dictionary<string, string>? metadata = null, CancellationToken cancellationToken = default)
    {
        _pathValidator.ValidateKey(key);
        ArgumentNullException.ThrowIfNull(data);

        try
        {
            await _client.PutObjectAsync(_options.BucketName ?? "storage", key, data, data.Length, contentType ?? "application/octet-stream");
            _logger.LogInformation("Uploaded object '{Key}' to MinIO.", key);
            return StorageResult.Success();
        }
        catch (MinioException ex)
        {
            _logger.LogError(ex, "Failed to upload object '{Key}' to MinIO.", key);
            throw new UploadFailedException(key, ex);
        }
    }

    public async Task<(Stream Data, StorageResult Result)> DownloadAsync(string key, CancellationToken cancellationToken = default)
    {
        _pathValidator.ValidateKey(key);

        try
        {
            var memoryStream = new MemoryStream();
            await _client.GetObjectAsync(_options.BucketName ?? "storage", key, stream => stream.CopyTo(memoryStream), cancellationToken);
            memoryStream.Position = 0;
            return (memoryStream, StorageResult.Success());
        }
        catch (ObjectNotFoundException)
        {
            throw new global::Sathus.Storage.Domain.Exceptions.ObjectNotFoundException(key);
        }
        catch (MinioException ex)
        {
            _logger.LogError(ex, "Failed to download object '{Key}' from MinIO.", key);
            throw new DownloadFailedException(key, ex);
        }
    }

    public async Task<StorageResult> DeleteAsync(string key, CancellationToken cancellationToken = default)
    {
        _pathValidator.ValidateKey(key);

        try
        {
            await _client.RemoveObjectAsync(_options.BucketName ?? "storage", key, cancellationToken);
            return StorageResult.Success();
        }
        catch (ObjectNotFoundException)
        {
            throw new global::Sathus.Storage.Domain.Exceptions.ObjectNotFoundException(key);
        }
        catch (MinioException ex)
        {
            _logger.LogError(ex, "Failed to delete object '{Key}' from MinIO.", key);
            return StorageResult.Failure($"Delete failed: {ex.Message}", "storage.delete_failed");
        }
    }

    public async Task<StorageResult> CopyAsync(string sourceKey, string destinationKey, CancellationToken cancellationToken = default)
    {
        _pathValidator.ValidateKey(sourceKey);
        _pathValidator.ValidateKey(destinationKey);

        try
        {
            await _client.CopyObjectAsync(_options.BucketName ?? "storage", destinationKey, $"{_options.BucketName ?? "storage"}/{sourceKey}", cancellationToken);
            return StorageResult.Success();
        }
        catch (MinioException ex)
        {
            _logger.LogError(ex, "Failed to copy object '{SourceKey}' to '{DestinationKey}' in MinIO.", sourceKey, destinationKey);
            return StorageResult.Failure($"Copy failed: {ex.Message}", "storage.copy_failed");
        }
    }

    public async Task<StorageResult> MoveAsync(string sourceKey, string destinationKey, CancellationToken cancellationToken = default)
    {
        var copyResult = await CopyAsync(sourceKey, destinationKey, cancellationToken);
        if (!copyResult.Succeeded) return copyResult;
        return await DeleteAsync(sourceKey, cancellationToken);
    }

    public async Task<StorageResult> RenameAsync(string key, string newKey, CancellationToken cancellationToken = default)
    {
        return await MoveAsync(key, newKey, cancellationToken);
    }

    public async Task<bool> ExistsAsync(string key, CancellationToken cancellationToken = default)
    {
        _pathValidator.ValidateKey(key);

        try
        {
            var stats = await _client.StatObjectAsync(_options.BucketName ?? "storage", key, cancellationToken);
            return stats.ObjectName == key;
        }
        catch (ObjectNotFoundException)
        {
            return false;
        }
    }

    public async Task<StorageObjectInfo?> GetMetadataAsync(string key, CancellationToken cancellationToken = default)
    {
        _pathValidator.ValidateKey(key);

        try
        {
            var stats = await _client.StatObjectAsync(_options.BucketName ?? "storage", key, cancellationToken);
            return new StorageObjectInfo(
                StorageKey.Create(key),
                StorageSize.FromBytes(stats.Size),
                ContentType.Create(stats.ContentType ?? "application/octet-stream"),
                stats.ETag,
                stats.VersionId,
                stats.LastModified,
                stats.LastModified,
                StorageProviderType.MinIO,
                stats.VersionId != null);
        }
        catch (ObjectNotFoundException)
        {
            return null;
        }
    }

    public async Task<SignedUrl> GenerateSignedUrlAsync(string key, TimeSpan expiration, string? httpMethod = null, CancellationToken cancellationToken = default)
    {
        _pathValidator.ValidateKey(key);
        var bucket = _options.BucketName ?? "storage";
        var method = httpMethod ?? "GET";

        try
        {
            string url = method.Equals("GET", StringComparison.OrdinalIgnoreCase)
                ? await _client.PresignedGetObjectAsync(bucket, key, expiration.TotalSeconds)
                : await _client.PresignedPutObjectAsync(bucket, key, expiration.TotalSeconds);

            var expiresAt = DateTimeOffset.UtcNow.Add(expiration);
            return new SignedUrl(url, new StorageEndpoint(new Uri(url)), expiresAt, method);
        }
        catch (MinioException ex)
        {
            _logger.LogError(ex, "Failed to generate signed URL for '{Key}' in MinIO.", key);
            throw new InvalidStorageConfigurationException("MinIO", $"Unable to generate signed URL: {ex.Message}");
        }
    }

    public string GeneratePublicUrl(string key)
    {
        _pathValidator.ValidateKey(key);
        return $"{( _options.UseSsl ? "https" : "http")}://{_options.Endpoint}/{_options.BucketName ?? "storage"}/{key}";
    }

    public async Task<Stream> GetObjectStreamAsync(string key, CancellationToken cancellationToken = default)
    {
        _pathValidator.ValidateKey(key);
        var (data, _) = await DownloadAsync(key, cancellationToken);
        return data;
    }

    public Task<StorageResult> CreateFolderAsync(string path, CancellationToken cancellationToken = default)
    {
        return Task.FromResult(StorageResult.Success());
    }

    public async Task<StorageResult> DeleteFolderAsync(string path, CancellationToken cancellationToken = default)
    {
        return StorageResult.Success();
    }

    public async Task<IReadOnlyList<StorageObjectInfo>> ListObjectsAsync(string prefix, int maxKeys = 1000, CancellationToken cancellationToken = default)
    {
        _pathValidator.ValidateKey(prefix);
        var results = new List<StorageObjectInfo>();

        try
        {
            var observable = _client.ListObjectsAsync(_options.BucketName ?? "storage", prefix);
            await foreach (var item in observable)
            {
                if (item.IsFolder) continue;
                results.Add(new StorageObjectInfo(
                    StorageKey.Create(item.Key),
                    StorageSize.FromBytes(item.Size),
                    ContentType.Create("application/octet-stream"),
                    item.ETag,
                    null,
                    item.LastModified,
                    item.LastModified,
                    StorageProviderType.MinIO,
                    false));
                if (results.Count >= maxKeys) break;
            }
        }
        catch (MinioException ex)
        {
            _logger.LogError(ex, "Failed to list objects in MinIO with prefix '{Prefix}'.", prefix);
        }

        return results;
    }
}


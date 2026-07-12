using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Sathus.Storage.Domain.Enums;
using Sathus.Storage.Domain.Exceptions;
using Sathus.Storage.Domain.Interfaces;
using Sathus.Storage.Domain.Results;
using Sathus.Storage.Domain.ValueObjects;
using Sathus.Storage.Infrastructure.Configuration;
using Sathus.Storage.Infrastructure.Security;

namespace Sathus.Storage.Infrastructure.Providers;

public class AwsS3StorageProvider : IStorageProvider
{
    private readonly IAmazonS3 _s3Client;
    private readonly S3Options _options;
    private readonly ILogger<AwsS3StorageProvider> _logger;
    private readonly StoragePathValidator _pathValidator;
    public string ProviderName { get; }
    public StorageProviderType ProviderType => StorageProviderType.AwsS3;
    public StorageLocation Location { get; }

    public AwsS3StorageProvider(IOptions<S3Options> options, ILogger<AwsS3StorageProvider> logger, StoragePathValidator pathValidator)
    {
        _options = options.Value;
        _logger = logger;
        _pathValidator = pathValidator;
        ProviderName = "s3";

        var config = new AmazonS3Config { RegionEndpoint = RegionEndpoint.GetBySystemName(_options.Region) };
        if (_options.ForcePathStyle)
            config.ForcePathStyle = true;

        _s3Client = new AmazonS3Client(_options.AccessKey, _options.SecretKey, config);
        Location = new StorageLocation(StorageProviderType.AwsS3, _options.BucketName, null, new StorageEndpoint(new Uri(_options.Region.Contains("us-east-1") ? "https://s3.amazonaws.com" : $"https://s3.{_options.Region}.amazonaws.com")), StorageRegion.Create(_options.Region));
    }

    public async Task<StorageResult> UploadAsync(string key, Stream data, string? contentType = null, Dictionary<string, string>? metadata = null, CancellationToken cancellationToken = default)
    {
        _pathValidator.ValidateKey(key);
        ArgumentNullException.ThrowIfNull(data);

        var request = new PutObjectRequest
        {
            BucketName = _options.BucketName ?? throw new InvalidStorageConfigurationException("S3", "BucketName is required."),
            Key = key,
            InputStream = data,
            ContentType = contentType ?? "application/octet-stream"
        };

        if (metadata != null)
            request.Metadata = new System.Collections.Generic.Dictionary<string, string>(metadata, StringComparer.OrdinalIgnoreCase);

        try
        {
            var response = await _s3Client.PutObjectAsync(request, cancellationToken);
            _logger.LogInformation("Uploaded object '{Key}' to S3. ETag: {ETag}", key, response.ETag);
            return StorageResult.Success();
        }
        catch (AmazonS3Exception ex)
        {
            _logger.LogError(ex, "Failed to upload object '{Key}' to S3.", key);
            throw new UploadFailedException(key, ex);
        }
    }

    public async Task<(Stream Data, StorageResult Result)> DownloadAsync(string key, CancellationToken cancellationToken = default)
    {
        _pathValidator.ValidateKey(key);

        try
        {
            var response = await _s3Client.GetObjectAsync(new GetObjectRequest
            {
                BucketName = _options.BucketName!,
                Key = key
            }, cancellationToken);

            var memoryStream = new MemoryStream();
            await response.ResponseStream.CopyToAsync(memoryStream, cancellationToken);
            memoryStream.Position = 0;
            return (memoryStream, StorageResult.Success());
        }
        catch (Amazon.S3.AmazonS3Exception ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            throw new ObjectNotFoundException(key);
        }
        catch (AmazonS3Exception ex)
        {
            _logger.LogError(ex, "Failed to download object '{Key}' from S3.", key);
            throw new DownloadFailedException(key, ex);
        }
    }

    public async Task<StorageResult> DeleteAsync(string key, CancellationToken cancellationToken = default)
    {
        _pathValidator.ValidateKey(key);

        try
        {
            await _s3Client.DeleteObjectAsync(_options.BucketName!, key, cancellationToken);
            return StorageResult.Success();
        }
        catch (Amazon.S3.AmazonS3Exception ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            throw new ObjectNotFoundException(key);
        }
        catch (AmazonS3Exception ex)
        {
            _logger.LogError(ex, "Failed to delete object '{Key}' from S3.", key);
            return StorageResult.Failure($"Delete failed: {ex.Message}", "storage.delete_failed");
        }
    }

    public async Task<StorageResult> CopyAsync(string sourceKey, string destinationKey, CancellationToken cancellationToken = default)
    {
        _pathValidator.ValidateKey(sourceKey);
        _pathValidator.ValidateKey(destinationKey);

        var request = new CopyObjectRequest
        {
            SourceBucket = _options.BucketName!,
            SourceKey = sourceKey,
            DestinationBucket = _options.BucketName!,
            DestinationKey = destinationKey
        };

        try
        {
            await _s3Client.CopyObjectAsync(request, cancellationToken);
            return StorageResult.Success();
        }
        catch (AmazonS3Exception ex)
        {
            _logger.LogError(ex, "Failed to copy object '{SourceKey}' to '{DestinationKey}' in S3.", sourceKey, destinationKey);
            return StorageResult.Failure($"Copy failed: {ex.Message}", "storage.copy_failed");
        }
    }

    public async Task<StorageResult> MoveAsync(string sourceKey, string destinationKey, CancellationToken cancellationToken = default)
    {
        var copyResult = await CopyAsync(sourceKey, destinationKey, cancellationToken);
        return copyResult.Succeeded ? await DeleteAsync(sourceKey, cancellationToken) : copyResult;
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
            await _s3Client.GetObjectMetadataAsync(new GetObjectMetadataRequest { BucketName = _options.BucketName!, Key = key }, cancellationToken);
            return true;
        }
        catch (Amazon.S3.AmazonS3Exception ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return false;
        }
    }

    public async Task<StorageObjectInfo?> GetMetadataAsync(string key, CancellationToken cancellationToken = default)
    {
        _pathValidator.ValidateKey(key);

        try
        {
            var response = await _s3Client.GetObjectMetadataAsync(new GetObjectMetadataRequest
            {
                BucketName = _options.BucketName!,
                Key = key
            }, cancellationToken);

            return new StorageObjectInfo(
                StorageKey.Create(key),
                StorageSize.FromBytes(response.ContentLength),
                ContentType.Create(response.Headers.ContentType ?? "application/octet-stream"),
                response.ETag,
                null,
                response.LastModified.ToUniversalTime(),
                response.LastModified.ToUniversalTime(),
                StorageProviderType.AwsS3,
                false);
        }
        catch (Amazon.S3.AmazonS3Exception ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return null;
        }
    }

    public async Task<SignedUrl> GenerateSignedUrlAsync(string key, TimeSpan expiration, string? httpMethod = null, CancellationToken cancellationToken = default)
    {
        _pathValidator.ValidateKey(key);

        var request = new GetPreSignedUrlRequest
        {
            BucketName = _options.BucketName ?? throw new InvalidStorageConfigurationException("S3", "BucketName is required."),
            Key = key,
            Expires = DateTime.UtcNow.Add(expiration)
        };

        var url = _s3Client.GetPreSignedURL(request);
        return new SignedUrl(url, new StorageEndpoint(new Uri(url)), DateTimeOffset.UtcNow.Add(expiration), httpMethod ?? "GET");
    }

    public string GeneratePublicUrl(string key)
    {
        _pathValidator.ValidateKey(key);
        var bucket = _options.BucketName ?? string.Empty;
        return $"https://{bucket}.s3.{_options.Region}.amazonaws.com/{key}";
    }

    public async Task<Stream> GetObjectStreamAsync(string key, CancellationToken cancellationToken = default)
    {
        _pathValidator.ValidateKey(key);
        var (data, _) = await DownloadAsync(key, cancellationToken);
        return data;
    }

    public Task<StorageResult> CreateFolderAsync(string path, CancellationToken cancellationToken = default)
    {
        return StorageResult.Success();
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
            var request = new ListObjectsV2Request
            {
                BucketName = _options.BucketName!,
                Prefix = prefix,
                MaxKeys = maxKeys
            };

            ListObjectsV2Response? response;
            do
            {
                response = await _s3Client.ListObjectsV2Async(request, cancellationToken);
                foreach (var item in response.S3Objects)
                {
                    results.Add(new StorageObjectInfo(
                        StorageKey.Create(item.Key),
                        StorageSize.FromBytes(item.Size),
                        ContentType.Create("application/octet-stream"),
                        item.ETag,
                        null,
                        item.LastModified.ToUniversalTime(),
                        item.LastModified.ToUniversalTime(),
                        StorageProviderType.AwsS3,
                        false));
                }
                request.ContinuationToken = response.NextContinuationToken;
            } while (response.IsTruncated && results.Count < maxKeys);
        }
        catch (AmazonS3Exception ex)
        {
            _logger.LogError(ex, "Failed to list objects in S3 with prefix '{Prefix}'.", prefix);
        }

        return results;
    }
}


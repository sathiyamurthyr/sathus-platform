using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
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

public class AzureBlobStorageProvider : IStorageProvider
{
    private readonly BlobServiceClient _blobServiceClient;
    private readonly AzureBlobOptions _options;
    private readonly ILogger<AzureBlobStorageProvider> _logger;
    private readonly StoragePathValidator _pathValidator;
    public string ProviderName { get; }
    public StorageProviderType ProviderType => StorageProviderType.AzureBlob;
    public StorageLocation Location { get; }

    public AzureBlobStorageProvider(IOptions<AzureBlobOptions> options, ILogger<AzureBlobStorageProvider> logger, StoragePathValidator pathValidator)
    {
        _options = options.Value;
        _logger = logger;
        _pathValidator = pathValidator;
        ProviderName = "azure-blob";

        _blobServiceClient = string.IsNullOrWhiteSpace(_options.ConnectionString)
            ? new BlobServiceClient(_options.BlobEndpoint ?? throw new InvalidStorageConfigurationException("AzureBlob", "ConnectionString or BlobEndpoint is required."))
            : new BlobServiceClient(_options.ConnectionString);

        Location = new StorageLocation(StorageProviderType.AzureBlob, null, _options.ContainerName, new StorageEndpoint(new Uri(string.IsNullOrWhiteSpace(_options.BlobEndpoint) ? _options.ConnectionString.Split(';').FirstOrDefault(s => s.StartsWith("AccountEndpoint=", StringComparison.OrdinalIgnoreCase))?.Split('=')[1] ?? string.Empty : _options.BlobEndpoint)), null);
    }

    public async Task<StorageResult> UploadAsync(string key, Stream data, string? contentType = null, Dictionary<string, string>? metadata = null, CancellationToken cancellationToken = default)
    {
        _pathValidator.ValidateKey(key);
        ArgumentNullException.ThrowIfNull(data);

        var container = _blobServiceClient.GetBlobContainerClient(_options.ContainerName);
        var blob = container.GetBlobClient(key);

        var headers = new BlobHttpHeaders { ContentType = contentType ?? "application/octet-stream" };
        var uploadOptions = new BlobUploadOptions
        {
            HttpHeaders = headers,
            Metadata = metadata
        };

        await blob.UploadAsync(data, uploadOptions, cancellationToken);
        _logger.LogInformation("Uploaded object '{Key}' to Azure Blob Storage.", key);
        return StorageResult.Success();
    }

    public async Task<(Stream Data, StorageResult Result)> DownloadAsync(string key, CancellationToken cancellationToken = default)
    {
        _pathValidator.ValidateKey(key);
        var container = _blobServiceClient.GetBlobContainerClient(_options.ContainerName);
        var blob = container.GetBlobClient(key);

        try
        {
            var response = await blob.DownloadAsync(cancellationToken);
            var stream = response.Value.Content;
            return (stream, StorageResult.Success());
        }
        catch (RequestFailedException ex) when (ex.Status == 404)
        {
            throw new ObjectNotFoundException(key);
        }
    }

    public async Task<StorageResult> DeleteAsync(string key, CancellationToken cancellationToken = default)
    {
        _pathValidator.ValidateKey(key);
        var container = _blobServiceClient.GetBlobContainerClient(_options.ContainerName);
        var blob = container.GetBlobClient(key);

        try
        {
            await blob.DeleteAsync(cancellationToken: cancellationToken);
            return StorageResult.Success();
        }
        catch (RequestFailedException ex) when (ex.Status == 404)
        {
            throw new ObjectNotFoundException(key);
        }
    }

    public async Task<StorageResult> CopyAsync(string sourceKey, string destinationKey, CancellationToken cancellationToken = default)
    {
        _pathValidator.ValidateKey(sourceKey);
        _pathValidator.ValidateKey(destinationKey);

        var container = _blobServiceClient.GetBlobContainerClient(_options.ContainerName);
        var sourceBlob = container.GetBlobClient(sourceKey);
        var destBlob = container.GetBlobClient(destinationKey);

        var copyOptions = new BlobCopyFromUriOptions();
        var operation = await destBlob.StartCopyFromUriAsync(sourceBlob.Uri, copyOptions, cancellationToken);
        await operation.WaitForCompletionAsync(cancellationToken);
        return StorageResult.Success();
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
        var container = _blobServiceClient.GetBlobContainerClient(_options.ContainerName);
        var blob = container.GetBlobClient(key);

        try
        {
            var response = await blob.ExistsAsync(cancellationToken);
            return response.Value;
        }
        catch (RequestFailedException)
        {
            return false;
        }
    }

    public async Task<StorageObjectInfo?> GetMetadataAsync(string key, CancellationToken cancellationToken = default)
    {
        _pathValidator.ValidateKey(key);
        var container = _blobServiceClient.GetBlobContainerClient(_options.ContainerName);
        var blob = container.GetBlobClient(key);

        try
        {
            var properties = await blob.GetPropertiesAsync(cancellationToken: cancellationToken);
            var p = properties.Value;

            return new StorageObjectInfo(
                StorageKey.Create(key),
                StorageSize.FromBytes(p.ContentLength),
                ContentType.Create(p.ContentType ?? "application/octet-stream"),
                p.ETag.ToString(),
                null,
                p.LastModified.UtcDateTime,
                p.CreatedOn.UtcDateTime,
                StorageProviderType.AzureBlob,
                false);
        }
        catch (RequestFailedException ex) when (ex.Status == 404)
        {
            return null;
        }
    }

    public Task<SignedUrl> GenerateSignedUrlAsync(string key, TimeSpan expiration, string? httpMethod = null, CancellationToken cancellationToken = default)
    {
        _pathValidator.ValidateKey(key);
        throw new NotImplementedException("Azure SignedUrl generation requires storage shared key or managed identity credentials.");
    }

    public string GeneratePublicUrl(string key)
    {
        _pathValidator.ValidateKey(key);
        var endpoint = _options.BlobEndpoint ?? throw new InvalidStorageConfigurationException("AzureBlob", "BlobEndpoint is required for public URLs.");
        return $"{endpoint.TrimEnd('/')}/{_options.ContainerName}/{key}";
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
        var container = _blobServiceClient.GetBlobContainerClient(_options.ContainerName);

        await foreach (var blobItem in container.GetBlobsAsync(prefix: prefix, cancellationToken: cancellationToken))
        {
            results.Add(new StorageObjectInfo(
                StorageKey.Create(blobItem.Name),
                StorageSize.FromBytes(blobItem.Properties.ContentLength ?? 0),
                ContentType.Create(blobItem.Properties.ContentType ?? "application/octet-stream"),
                blobItem.Properties.ETag.ToString(),
                null,
                blobItem.Properties.LastModified?.UtcDateTime,
                blobItem.Properties.CreatedOn?.UtcDateTime,
                StorageProviderType.AzureBlob,
                false));

            if (results.Count >= maxKeys) break;
        }

        return results;
    }
}


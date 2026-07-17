using System;
using System.Threading;
using System.Threading.Tasks;
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

public class GoogleCloudStorageProvider : IStorageProvider
{
    private readonly ILogger<GoogleCloudStorageProvider> _logger;
    private readonly StoragePathValidator _pathValidator;
    public string ProviderName => throw new NotImplementedException();
    public StorageProviderType ProviderType => StorageProviderType.GoogleCloud;
    public StorageLocation Location => throw new NotImplementedException();

    public GoogleCloudStorageProvider(ILogger<GoogleCloudStorageProvider> logger, StoragePathValidator pathValidator)
    {
        _logger = logger;
        _pathValidator = pathValidator;
    }

    public Task<StorageResult> UploadAsync(string key, Stream data, string? contentType = null, Dictionary<string, string>? metadata = null, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException("Google Cloud Storage provider is not yet implemented.");
    }

    public Task<(Stream Data, StorageResult Result)> DownloadAsync(string key, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException("Google Cloud Storage provider is not yet implemented.");
    }

    public Task<StorageResult> DeleteAsync(string key, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException("Google Cloud Storage provider is not yet implemented.");
    }

    public Task<StorageResult> CopyAsync(string sourceKey, string destinationKey, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException("Google Cloud Storage provider is not yet implemented.");
    }

    public Task<StorageResult> MoveAsync(string sourceKey, string destinationKey, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException("Google Cloud Storage provider is not yet implemented.");
    }

    public Task<StorageResult> RenameAsync(string key, string newKey, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException("Google Cloud Storage provider is not yet implemented.");
    }

    public Task<bool> ExistsAsync(string key, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException("Google Cloud Storage provider is not yet implemented.");
    }

    public Task<StorageObjectInfo?> GetMetadataAsync(string key, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException("Google Cloud Storage provider is not yet implemented.");
    }

    public Task<SignedUrl> GenerateSignedUrlAsync(string key, TimeSpan expiration, string? httpMethod = null, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException("Google Cloud Storage provider is not yet implemented.");
    }

    public string GeneratePublicUrl(string key)
    {
        throw new NotImplementedException("Google Cloud Storage provider is not yet implemented.");
    }

    public Task<Stream> GetObjectStreamAsync(string key, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException("Google Cloud Storage provider is not yet implemented.");
    }

    public Task<StorageResult> CreateFolderAsync(string path, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException("Google Cloud Storage provider is not yet implemented.");
    }

    public Task<StorageResult> DeleteFolderAsync(string path, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException("Google Cloud Storage provider is not yet implemented.");
    }

    public Task<IReadOnlyList<StorageObjectInfo>> ListObjectsAsync(string prefix, int maxKeys = 1000, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException("Google Cloud Storage provider is not yet implemented.");
    }
}


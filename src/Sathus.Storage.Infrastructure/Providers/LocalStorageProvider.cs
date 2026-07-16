using System.IO;
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

public class LocalStorageProvider : IStorageProvider
{
    private readonly LocalStorageOptions _options;
    private readonly ILogger<LocalStorageProvider> _logger;
    private readonly StoragePathValidator _pathValidator;
    public string ProviderName { get; }
    public StorageProviderType ProviderType => StorageProviderType.Local;
    public StorageLocation Location { get; }

    public LocalStorageProvider(IOptions<LocalStorageOptions> options, ILogger<LocalStorageProvider> logger, StoragePathValidator pathValidator)
    {
        _options = options.Value;
        _logger = logger;
        _pathValidator = pathValidator;
        ProviderName = "local";

        var root = new DirectoryInfo(_options.RootPath);
        Location = new StorageLocation(StorageProviderType.Local, null, null, new StorageEndpoint(new Uri(root.FullName)), null);
    }

    public async Task<StorageResult> UploadAsync(string key, Stream data, string? contentType = null, Dictionary<string, string>? metadata = null, CancellationToken cancellationToken = default)
    {
        _pathValidator.ValidateKey(key);
        ArgumentNullException.ThrowIfNull(data);

        var fullPath = GetFullPath(key);
        var directory = Path.GetDirectoryName(fullPath)!;
        if (_options.CreateDirectories && !Directory.Exists(directory))
            Directory.CreateDirectory(directory);

        await using var fileStream = new FileStream(fullPath, FileMode.Create, FileAccess.Write, FileShare.None, 8192, useAsync: true);
        await data.CopyToAsync(fileStream, cancellationToken);

        _logger.LogInformation("Uploaded object '{Key}' to local storage.", key);
        return StorageResult.Success();
    }

    public async Task<(Stream Data, StorageResult Result)> DownloadAsync(string key, CancellationToken cancellationToken = default)
    {
        _pathValidator.ValidateKey(key);
        var fullPath = GetFullPath(key);

        if (!File.Exists(fullPath))
            throw new ObjectNotFoundException(key);

        var stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.Read, 8192, useAsync: true);
        return (stream, StorageResult.Success());
    }

    public async Task<StorageResult> DeleteAsync(string key, CancellationToken cancellationToken = default)
    {
        _pathValidator.ValidateKey(key);
        var fullPath = GetFullPath(key);

        if (!File.Exists(fullPath))
            throw new ObjectNotFoundException(key);

        File.Delete(fullPath);
        await Task.CompletedTask;
        return StorageResult.Success();
    }

    public Task<StorageResult> CopyAsync(string sourceKey, string destinationKey, CancellationToken cancellationToken = default)
    {
        _pathValidator.ValidateKey(sourceKey);
        _pathValidator.ValidateKey(destinationKey);

        var sourcePath = GetFullPath(sourceKey);
        var destPath = GetFullPath(destinationKey);

        if (!File.Exists(sourcePath))
            throw new ObjectNotFoundException(sourceKey);

        var destDir = Path.GetDirectoryName(destPath)!;
        if (_options.CreateDirectories && !Directory.Exists(destDir))
            Directory.CreateDirectory(destDir);

        File.Copy(sourcePath, destPath, overwrite: true);
        return Task.FromResult(StorageResult.Success());
    }

    public async Task<StorageResult> MoveAsync(string sourceKey, string destinationKey, CancellationToken cancellationToken = default)
    {
        var moveResult = await CopyAsync(sourceKey, destinationKey, cancellationToken);
        if (!moveResult.Succeeded) return moveResult;

        var deleteResult = await DeleteAsync(sourceKey, cancellationToken);
        return deleteResult.Succeeded ? StorageResult.Success() : deleteResult;
    }

    public async Task<StorageResult> RenameAsync(string key, string newKey, CancellationToken cancellationToken = default)
    {
        _pathValidator.ValidateKey(key);
        _pathValidator.ValidateKey(newKey);

        var sourcePath = GetFullPath(key);
        var destPath = GetFullPath(newKey);

        if (!File.Exists(sourcePath))
            throw new ObjectNotFoundException(key);

        var destDir = Path.GetDirectoryName(destPath)!;
        if (_options.CreateDirectories && !Directory.Exists(destDir))
            Directory.CreateDirectory(destDir);

        File.Move(sourcePath, destPath);
        return StorageResult.Success();
    }

    public Task<bool> ExistsAsync(string key, CancellationToken cancellationToken = default)
    {
        _pathValidator.ValidateKey(key);
        return Task.FromResult(File.Exists(GetFullPath(key)));
    }

    public async Task<StorageObjectInfo?> GetMetadataAsync(string key, CancellationToken cancellationToken = default)
    {
        _pathValidator.ValidateKey(key);
        var fullPath = GetFullPath(key);

        if (!File.Exists(fullPath))
            return null;

        var fileInfo = new FileInfo(fullPath);
        await Task.CompletedTask;
        return new StorageObjectInfo(
            StorageKey.Create(key),
            StorageSize.FromBytes(fileInfo.Length),
            null,
            null,
            null,
            fileInfo.LastWriteTimeUtc,
            fileInfo.CreationTimeUtc,
            StorageProviderType.Local,
            false);
    }

    public Task<SignedUrl> GenerateSignedUrlAsync(string key, TimeSpan expiration, string? httpMethod = null, CancellationToken cancellationToken = default)
    {
        _pathValidator.ValidateKey(key);
        var fullPath = GetFullPath(key);
        var expiresAt = DateTimeOffset.UtcNow.Add(expiration);

        var url = _options.PublicUrlBase != string.Empty
            ? $"{_options.PublicUrlBase.TrimEnd('/')}/{key}"
            : new Uri(fullPath).AbsoluteUri;

        return Task.FromResult(new SignedUrl(url, new StorageEndpoint(new Uri(url)), expiresAt, httpMethod ?? "GET"));
    }

    public string GeneratePublicUrl(string key)
    {
        _pathValidator.ValidateKey(key);
        return _options.PublicUrlBase != string.Empty
            ? $"{_options.PublicUrlBase.TrimEnd('/')}/{key}"
            : new Uri(GetFullPath(key)).AbsoluteUri;
    }

    public async Task<Stream> GetObjectStreamAsync(string key, CancellationToken cancellationToken = default)
    {
        _pathValidator.ValidateKey(key);
        var fullPath = GetFullPath(key);

        if (!File.Exists(fullPath))
            throw new ObjectNotFoundException(key);

        return new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.Read, 8192, useAsync: true);
    }

    public Task<StorageResult> CreateFolderAsync(string path, CancellationToken cancellationToken = default)
    {
        var fullPath = GetFullPath(path);
        Directory.CreateDirectory(fullPath);
        return Task.FromResult(StorageResult.Success());
    }

    public async Task<StorageResult> DeleteFolderAsync(string path, CancellationToken cancellationToken = default)
    {
        var fullPath = GetFullPath(path);
        if (!Directory.Exists(fullPath))
            return StorageResult.Success();

        Directory.Delete(fullPath, recursive: true);
        await Task.CompletedTask;
        return StorageResult.Success();
    }

    public async Task<IReadOnlyList<StorageObjectInfo>> ListObjectsAsync(string prefix, int maxKeys = 1000, CancellationToken cancellationToken = default)
    {
        _pathValidator.ValidateKey(prefix);
        var results = new List<StorageObjectInfo>();
        var searchPath = GetFullPath(prefix);
        var directory = new DirectoryInfo(searchPath);

        if (!directory.Exists)
            return results;

        var files = directory.GetFiles("*", SearchOption.TopDirectoryOnly);
        foreach (var file in files.Take(maxKeys))
        {
            var relativePath = Path.GetRelativePath(_options.RootPath, file.FullName).Replace('\\', '/');
            results.Add(new StorageObjectInfo(
                StorageKey.Create(relativePath),
                StorageSize.FromBytes(file.Length),
                null,
                null,
                null,
                file.LastWriteTimeUtc,
                file.CreationTimeUtc,
                StorageProviderType.Local,
                false));
        }

        await Task.CompletedTask;
        return results;
    }

    private string GetFullPath(string key)
    {
        var sanitized = key.Replace('\\', '/').Trim('/');
        return Path.Combine(_options.RootPath, sanitized.Replace('/', Path.DirectorySeparatorChar));
    }
}

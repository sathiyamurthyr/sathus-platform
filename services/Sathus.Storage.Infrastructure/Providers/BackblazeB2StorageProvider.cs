using System;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Text.Json;
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

public class BackblazeB2StorageProvider : IStorageProvider
{
    private readonly BackblazeOptions _options;
    private readonly ILogger<BackblazeB2StorageProvider> _logger;
    private readonly StoragePathValidator _pathValidator;
    private readonly IHttpClientFactory _httpClientFactory;
    private string? _authorizationToken;
    private string? _downloadUrl;

    public string ProviderName { get; }
    public StorageProviderType ProviderType => StorageProviderType.BackblazeB2;
    public StorageLocation Location { get; }

    public BackblazeB2StorageProvider(IOptions<BackblazeOptions> options, ILogger<BackblazeB2StorageProvider> logger, StoragePathValidator pathValidator, IHttpClientFactory httpClientFactory)
    {
        _options = options.Value;
        _logger = logger;
        _pathValidator = pathValidator;
        _httpClientFactory = httpClientFactory;
        ProviderName = "backblaze-b2";

        var endpoint = _options.Endpoint ?? "https://api.backblazeb2.com";
        Location = new StorageLocation(StorageProviderType.BackblazeB2, _options.BucketName, null, new StorageEndpoint(new Uri(endpoint)), null);
    }

    public async Task<StorageResult> UploadAsync(string key, Stream data, string? contentType = null, Dictionary<string, string>? metadata = null, CancellationToken cancellationToken = default)
    {
        await EnsureAuthorizedAsync(cancellationToken);
        _pathValidator.ValidateKey(key);

        var uploadUrl = await GetUploadUrlAsync(cancellationToken);
        var fileName = key;
        var client = _httpClientFactory.CreateClient();

        using var content = new StreamContent(data);
        if (!string.IsNullOrEmpty(contentType))
            content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(contentType);

        using var request = new HttpRequestMessage(HttpMethod.Post, $"{uploadUrl.uploadUrl}/{fileName}")
        {
            Content = content
        };
        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue(_authorizationToken);

        var response = await client.SendAsync(request, cancellationToken);
        response.EnsureSuccessStatusCode();

        _logger.LogInformation("Uploaded object '{Key}' to Backblaze B2.", key);
        return StorageResult.Success();
    }

    public async Task<(Stream Data, StorageResult Result)> DownloadAsync(string key, CancellationToken cancellationToken = default)
    {
        await EnsureAuthorizedAsync(cancellationToken);
        _pathValidator.ValidateKey(key);

        var downloadUrl = _downloadUrl ?? throw new InvalidStorageConfigurationException("Backblaze", "Download URL is not configured.");
        var client = _httpClientFactory.CreateClient();
        var url = $"{downloadUrl}/file/{_options.BucketName}/{key}";

        var response = await client.GetAsync(url, cancellationToken);
        if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            throw new ObjectNotFoundException(key);

        response.EnsureSuccessStatusCode();
        var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
        return (stream, StorageResult.Success());
    }

    public async Task<StorageResult> DeleteAsync(string key, CancellationToken cancellationToken = default)
    {
        await EnsureAuthorizedAsync(cancellationToken);
        _pathValidator.ValidateKey(key);

        var fileId = await GetFileIdAsync(key, cancellationToken);
        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue(_authorizationToken);

        var response = await client.DeleteAsync($"https://api.backblazeb2.com/b2api/v2/b2_delete_file_version?fileId={fileId}&fileName={Uri.EscapeDataString(key)}", cancellationToken);
        response.EnsureSuccessStatusCode();
        return StorageResult.Success();
    }

    public Task<StorageResult> CopyAsync(string sourceKey, string destinationKey, CancellationToken cancellationToken = default)
    {
        throw new NotSupportedException("Backblaze B2 provider does not support server-side copy.");
    }

    public Task<StorageResult> MoveAsync(string sourceKey, string destinationKey, CancellationToken cancellationToken = default)
    {
        throw new NotSupportedException("Backblaze B2 provider does not support server-side move.");
    }

    public Task<StorageResult> RenameAsync(string key, string newKey, CancellationToken cancellationToken = default)
    {
        throw new NotSupportedException("Backblaze B2 provider does not support rename.");
    }

    public async Task<bool> ExistsAsync(string key, CancellationToken cancellationToken = default)
    {
        await EnsureAuthorizedAsync(cancellationToken);
        _pathValidator.ValidateKey(key);

        try
        {
            var fileId = await GetFileIdAsync(key, cancellationToken);
            return !string.IsNullOrEmpty(fileId);
        }
        catch
        {
            return false;
        }
    }

    public async Task<StorageObjectInfo?> GetMetadataAsync(string key, CancellationToken cancellationToken = default)
    {
        await EnsureAuthorizedAsync(cancellationToken);
        _pathValidator.ValidateKey(key);

        try
        {
            var fileId = await GetFileIdAsync(key, cancellationToken);
            if (string.IsNullOrEmpty(fileId)) return null;

            var client = _httpClientFactory.CreateClient();
            var response = await client.GetAsync($"https://api.backblazeb2.com/b2api/v2/b2_get_file_info?fileId={fileId}", cancellationToken);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync(cancellationToken);
            var doc = JsonDocument.Parse(json);
            var info = doc.RootElement;

            return new StorageObjectInfo(
                StorageKey.Create(key),
                StorageSize.FromBytes(info.GetProperty("contentLength").GetInt64()),
                ContentType.Create(info.GetProperty("contentType").GetString() ?? "application/octet-stream"),
                info.GetProperty("fileId").GetString(),
                null,
                DateTimeOffset.FromUnixTimeMilliseconds(info.GetProperty("uploadTimestamp").GetInt64()),
                DateTimeOffset.FromUnixTimeMilliseconds(info.GetProperty("uploadTimestamp").GetInt64()),
                StorageProviderType.BackblazeB2,
                false);
        }
        catch
        {
            return null;
        }
    }

    public async Task<SignedUrl> GenerateSignedUrlAsync(string key, TimeSpan expiration, string? httpMethod = null, CancellationToken cancellationToken = default)
    {
        await EnsureAuthorizedAsync(cancellationToken);
        _pathValidator.ValidateKey(key);

        var downloadUrl = _downloadUrl ?? throw new InvalidStorageConfigurationException("Backblaze", "Download URL is not configured.");
        var url = $"{downloadUrl}/file/{_options.BucketName}/{key}";
        var expiresAt = DateTimeOffset.UtcNow.Add(expiration);
        return new SignedUrl(url, new StorageEndpoint(new Uri(url)), expiresAt, httpMethod ?? "GET");
    }

    public string GeneratePublicUrl(string key)
    {
        _pathValidator.ValidateKey(key);
        var downloadUrl = _downloadUrl ?? "https://f000.backblazeb2.com";
        return $"{downloadUrl}/file/{_options.BucketName}/{key}";
    }

    public async Task<Stream> GetObjectStreamAsync(string key, CancellationToken cancellationToken = default)
    {
        var (data, _) = await DownloadAsync(key, cancellationToken);
        return data;
    }

    public async Task<StorageResult> CreateFolderAsync(string path, CancellationToken cancellationToken = default)
    {
        return StorageResult.Success();
    }

    public async Task<StorageResult> DeleteFolderAsync(string path, CancellationToken cancellationToken = default)
    {
        return StorageResult.Success();
    }

    public async Task<IReadOnlyList<StorageObjectInfo>> ListObjectsAsync(string prefix, int maxKeys = 1000, CancellationToken cancellationToken = default)
    {
        await EnsureAuthorizedAsync(cancellationToken);
        _pathValidator.ValidateKey(prefix);
        var results = new List<StorageObjectInfo>();

        var client = _httpClientFactory.CreateClient();
        var response = await client.GetAsync($"https://api.backblazeb2.com/b2api/v2/b2_list_file_names?bucketId={_options.BucketId}&prefix={Uri.EscapeDataString(prefix)}&maxFileCount={maxKeys}", cancellationToken);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync(cancellationToken);
        var doc = JsonDocument.Parse(json);
        foreach (var file in doc.RootElement.GetProperty("files").EnumerateArray())
        {
            results.Add(new StorageObjectInfo(
                StorageKey.Create(file.GetProperty("fileName").GetString()!),
                StorageSize.FromBytes(file.GetProperty("contentLength").GetInt64()),
                ContentType.Create(file.GetProperty("contentType").GetString() ?? "application/octet-stream"),
                file.GetProperty("fileId").GetString(),
                null,
                DateTimeOffset.FromUnixTimeMilliseconds(file.GetProperty("uploadTimestamp").GetInt64()),
                DateTimeOffset.FromUnixTimeMilliseconds(file.GetProperty("uploadTimestamp").GetInt64()),
                StorageProviderType.BackblazeB2,
                false));
        }

        return results;
    }

    private async Task EnsureAuthorizedAsync(CancellationToken cancellationToken)
    {
        if (!string.IsNullOrEmpty(_authorizationToken)) return;

        var client = _httpClientFactory.CreateClient();
        var request = new
        {
            _options.ApplicationKeyId,
            _options.ApplicationKey
        };

        using var content = new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json");
        var response = await client.PostAsync("https://api.backblazeb2.com/b2api/v2/b2_authorize_account", content, cancellationToken);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync(cancellationToken);
        var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;

        _authorizationToken = root.GetProperty("authorizationToken").GetString();
        _downloadUrl = root.GetProperty("downloadUrl").GetString();
    }

    private async Task<(string uploadUrl, string authorizationToken)> GetUploadUrlAsync(CancellationToken cancellationToken)
    {
        await EnsureAuthorizedAsync(cancellationToken);

        var client = _httpClientFactory.CreateClient();
        var response = await client.GetAsync($"https://api.backblazeb2.com/b2api/v2/b2_get_upload_url?bucketId={_options.BucketId}", cancellationToken);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync(cancellationToken);
        var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;

        return (root.GetProperty("uploadUrl").GetString()!, root.GetProperty("authorizationToken").GetString()!);
    }

    private async Task<string> GetFileIdAsync(string key, CancellationToken cancellationToken)
    {
        var client = _httpClientFactory.CreateClient();
        var response = await client.GetAsync($"https://api.backblazeb2.com/b2api/v2/b2_list_file_names?bucketId={_options.BucketId}&prefix={Uri.EscapeDataString(key)}&maxFileCount=1", cancellationToken);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync(cancellationToken);
        var doc = JsonDocument.Parse(json);
        var files = doc.RootElement.GetProperty("files");

        return files.GetArrayLength() > 0 ? files[0].GetProperty("fileId").GetString()! : string.Empty;
    }
}


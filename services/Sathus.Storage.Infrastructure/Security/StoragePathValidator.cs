using System.Text.RegularExpressions;
using Microsoft.Extensions.Logging;
using Sathus.Storage.Domain.ValueObjects;

namespace Sathus.Storage.Infrastructure.Security;

public class StoragePathValidator
{
    private static readonly Regex InvalidPathChars = new(@"[<>:""|?*\x00-\x1F]", RegexOptions.Compiled);
    private static readonly Regex PathTraversal = new(@"\.\.[/\\]", RegexOptions.Compiled);
    private readonly ILogger<StoragePathValidator> _logger;

    public StoragePathValidator(ILogger<StoragePathValidator> logger)
    {
        _logger = logger;
    }

    public void ValidateKey(string key)
    {
        if (string.IsNullOrWhiteSpace(key))
            throw new ArgumentException("Storage key cannot be empty.", nameof(key));

        if (key.Length > 1024)
            throw new ArgumentException("Storage key exceeds maximum length of 1024.", nameof(key));

        if (InvalidPathChars.IsMatch(key))
            throw new ArgumentException("Storage key contains invalid characters.", nameof(key));

        if (PathTraversal.IsMatch(key) || key.Contains(".."))
            throw new ArgumentException("Storage key contains path traversal sequences.", nameof(key));

        if (key.StartsWith("/") || key.StartsWith("\\"))
            throw new ArgumentException("Storage key cannot start with a separator.", nameof(key));
    }

    public void ValidateFileName(string fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
            throw new ArgumentException("File name cannot be empty.", nameof(fileName));

        if (fileName.Length > 255)
            throw new ArgumentException("File name exceeds maximum length of 255.", nameof(fileName));

        if (InvalidPathChars.IsMatch(fileName))
            throw new ArgumentException("File name contains invalid characters.", nameof(fileName));

        if (PathTraversal.IsMatch(fileName))
            throw new ArgumentException("File name contains path traversal sequences.", nameof(fileName));
    }
}

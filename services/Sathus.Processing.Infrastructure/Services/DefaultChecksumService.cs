using System.Security.Cryptography;
using Sathus.Processing.Application.Interfaces;
using Sathus.Processing.Domain.Exceptions;

namespace Sathus.Processing.Infrastructure.Services;

/// <summary>
/// Computes content checksums (SHA-256 by default, SHA-1/MD5 supported) used for
/// integrity verification and duplicate detection.
/// </summary>
public sealed class DefaultChecksumService : IChecksumService
{
    public Task<string> ComputeAsync(Stream stream, string algorithm = "sha256", CancellationToken cancellationToken = default)
    {
        var normalized = (algorithm ?? "sha256").ToLowerInvariant();
        using HashAlgorithm hashAlgorithm = normalized switch
        {
            "md5" => MD5.Create(),
            "sha1" => SHA1.Create(),
            "sha256" => SHA256.Create(),
            "sha512" => SHA512.Create(),
            _ => throw new ArgumentException($"Unsupported hash algorithm '{algorithm}'.", nameof(algorithm))
        };

        var bytes = hashAlgorithm.ComputeHash(stream);
        return Task.FromResult($"{normalized}:{Convert.ToHexString(bytes).ToLowerInvariant()}");
    }
}

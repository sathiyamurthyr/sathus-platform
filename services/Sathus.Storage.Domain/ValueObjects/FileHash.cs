namespace Sathus.Storage.Domain.ValueObjects;

public readonly record struct FileHash(string Algorithm, string Value)
{
    public static FileHash Create(string algorithm, string value)
    {
        if (string.IsNullOrWhiteSpace(algorithm))
            throw new ArgumentException("Hash algorithm cannot be empty.", nameof(algorithm));

        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Hash value cannot be empty.", nameof(value));

        algorithm = algorithm.Trim().ToLowerInvariant();
        var supported = new[] { "md5", "sha1", "sha256", "sha384", "sha512", "crc32c" };
        if (!supported.Contains(algorithm))
            throw new ArgumentException($"Unsupported hash algorithm '{algorithm}'.", nameof(algorithm));

        return new FileHash(algorithm, value.Trim().ToLowerInvariant());
    }

    public static implicit operator string(FileHash hash) => hash.Value;
    public override string ToString() => $"{Algorithm}:{Value}";
}

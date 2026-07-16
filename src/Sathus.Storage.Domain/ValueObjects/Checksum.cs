namespace Sathus.Storage.Domain.ValueObjects;

public readonly record struct Checksum(string Algorithm, string Value)
{
    public static Checksum Create(string algorithm, string value)
    {
        if (string.IsNullOrWhiteSpace(algorithm))
            throw new ArgumentException("Checksum algorithm cannot be empty.", nameof(algorithm));

        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Checksum value cannot be empty.", nameof(value));

        algorithm = algorithm.Trim().ToLowerInvariant();
        var supported = new[] { "md5", "sha1", "sha256", "sha384", "sha512", "crc32c", "etag" };
        if (!supported.Contains(algorithm))
            throw new ArgumentException($"Unsupported checksum algorithm '{algorithm}'.", nameof(algorithm));

        return new Checksum(algorithm, value.Trim().ToLowerInvariant());
    }

    public static implicit operator string(Checksum checksum) => checksum.Value;
    public override string ToString() => $"{Algorithm}:{Value}";
}

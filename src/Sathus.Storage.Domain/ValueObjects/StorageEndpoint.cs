using System;

namespace Sathus.Storage.Domain.ValueObjects;

public readonly record struct StorageEndpoint(Uri Value)
{
    public static StorageEndpoint Create(string uri)
    {
        if (string.IsNullOrWhiteSpace(uri))
            throw new ArgumentException("Endpoint URI cannot be empty.", nameof(uri));

        if (!Uri.TryCreate(uri.Trim(), UriKind.Absolute, out var parsed))
            throw new ArgumentException("Endpoint URI is not a valid absolute URI.", nameof(uri));

        if (parsed.Scheme != Uri.UriSchemeHttp && parsed.Scheme != Uri.UriSchemeHttps)
            throw new ArgumentException("Endpoint URI must be HTTP or HTTPS.", nameof(uri));

        return new StorageEndpoint(parsed);
    }

    public static StorageEndpoint Create(Uri uri)
    {
        if (uri is null)
            throw new ArgumentNullException(nameof(uri));

        if (uri.Scheme != Uri.UriSchemeHttp && uri.Scheme != Uri.UriSchemeHttps)
            throw new ArgumentException("Endpoint URI must be HTTP or HTTPS.", nameof(uri));

        return new StorageEndpoint(uri);
    }

    public static implicit operator Uri(StorageEndpoint endpoint) => endpoint.Value;
    public override string ToString() => Value.ToString();
}

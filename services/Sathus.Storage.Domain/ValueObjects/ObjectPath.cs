namespace Sathus.Storage.Domain.ValueObjects;

public readonly record struct ObjectPath(string Value)
{
    public static ObjectPath Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Object path cannot be empty.", nameof(value));

        value = value.Trim();

        if (value.Contains(".."))
            throw new ArgumentException("Object path contains path traversal sequences.", nameof(value));

        if (value.StartsWith("/") || value.StartsWith("\\"))
            throw new ArgumentException("Object path cannot start with a separator.", nameof(value));

        var sanitized = value.Replace('\\', '/');
        while (sanitized.Contains("//"))
            sanitized = sanitized.Replace("//", "/");

        return new ObjectPath(sanitized);
    }

    public static ObjectPath Combine(params string[] segments)
    {
        if (segments.Length == 0)
            throw new ArgumentException("At least one segment is required.", nameof(segments));

        var combined = string.Join("/", segments.Select(segment =>
        {
            segment = segment.Trim();
            if (segment.Contains(".."))
                throw new ArgumentException("Path segment contains traversal sequences.", nameof(segment));
            return segment.Replace('\\', '/').Trim('/');
        }).Where(s => !string.IsNullOrEmpty(s)));

        return Create(combined);
    }

    public static implicit operator string(ObjectPath path) => path.Value;
    public override string ToString() => Value;
}

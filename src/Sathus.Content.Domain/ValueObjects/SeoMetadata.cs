namespace Sathus.Content.Domain.ValueObjects;

public sealed record SeoMetadata(
    string? Canonical = null,
    string? Robots = null,
    bool NoIndex = false,
    string? FocusKeyword = null);

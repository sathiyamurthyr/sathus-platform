namespace Sathus.Processing.Application.DTOs;

public sealed record RenditionResponse(
    string Kind,
    string Format,
    int? Width,
    int? Height,
    long SizeBytes,
    string StorageKey,
    string? Url);

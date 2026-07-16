namespace Sathus.Processing.Domain;

/// <summary>
/// Tunable processing behaviour. Injected into the pipeline and honoured by the
/// registered processors, so future modules can extend or override behaviour.
/// </summary>
public sealed class ProcessingOptions
{
    public bool IncludeGps { get; init; } = false;
    public int ThumbnailWidth { get; init; } = 320;
    public int SmallWidth { get; init; } = 480;
    public int MediumWidth { get; init; } = 1024;
    public int LargeWidth { get; init; } = 2048;
    public int PreviewWidth { get; init; } = 1280;
    public bool GenerateWebP { get; init; } = true;
    public bool GenerateAvif { get; init; } = true;
    public bool GenerateBlurPlaceholder { get; init; } = true;

    public static ProcessingOptions Default { get; } = new();
}

namespace Sathus.Processing.Domain.Enums;

/// <summary>
/// Ordered pipeline stages executed while processing an asset. Each stage is
/// independently observable and extensible.
/// </summary>
public enum ProcessingStep
{
    None = 0,
    Validation = 1,
    VirusScan = 2,
    MetadataExtraction = 3,
    Checksum = 4,
    DuplicateDetection = 5,
    ImageProcessing = 6,
    VideoProcessing = 7,
    DocumentProcessing = 8,
    AudioProcessing = 9,
    ArchiveProcessing = 10,
    ThumbnailGeneration = 11,
    BlurPlaceholder = 12,
    Ready = 13
}

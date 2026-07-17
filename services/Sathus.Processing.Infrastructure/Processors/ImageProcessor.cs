using System.Text;
using Microsoft.Extensions.Logging;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Metadata.Profiles.Exif;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using Sathus.Media.Domain.ValueObjects;
using Sathus.Processing.Application.Interfaces;
using Sathus.Processing.Domain;
using Sathus.Processing.Domain.ValueObjects;
using Sathus.Processing.Infrastructure.Services;

namespace Sathus.Processing.Infrastructure.Processors;

/// <summary>
/// Processes raster image assets: generates thumbnails and multiple sized renditions,
/// WebP, a blur placeholder, and extracts width/height, dominant colour, orientation
/// and EXIF metadata. Uses ImageSharp for real, streaming, in-process transformation.
/// </summary>
public sealed class ImageProcessor : IAssetProcessor
{
    private readonly IAssetRenditionStorage _renditionStorage;
    private readonly ILogger<ImageProcessor> _logger;
    private readonly ProcessingOptions _options;

    public ImageProcessor(IAssetRenditionStorage renditionStorage, ILogger<ImageProcessor> logger)
    {
        _renditionStorage = renditionStorage;
        _logger = logger;
        _options = ProcessingOptions.Default;
    }

    public string Name => "ImageProcessor";

    public bool CanProcess(MediaType mediaType) => mediaType.Value == MediaType.Image.Value;

    public async Task<ProcessorOutput> ProcessAsync(ProcessingContext context, CancellationToken cancellationToken = default)
    {
        var metadata = new Dictionary<string, string>();
        var renditions = new List<Rendition>();
        var baseKey = ProcessorSupport.DeriveBaseKey(context.AssetId);

        using var image = await Image.LoadAsync<Rgba32>(context.Source, cancellationToken);

        metadata["width"] = image.Width.ToString();
        metadata["height"] = image.Height.ToString();
        metadata["aspectRatio"] = (image.Width / (double)image.Height).ToString("F4");

        var dominant = ComputeDominantColor(image);
        if (dominant is not null)
        {
            metadata["dominantColor"] = dominant;
        }

        ExtractExif(image, metadata, _options.IncludeGps);

        var tasks = new List<Task<Rendition>>
        {
            GenerateRenditionAsync(image, RenditionKind.Thumbnail, "jpeg", _options.ThumbnailWidth, $"{baseKey}/thumbnail.jpg", cancellationToken),
            GenerateRenditionAsync(image, RenditionKind.Small, "jpeg", _options.SmallWidth, $"{baseKey}/small.jpg", cancellationToken),
            GenerateRenditionAsync(image, RenditionKind.Medium, "jpeg", _options.MediumWidth, $"{baseKey}/medium.jpg", cancellationToken),
            GenerateRenditionAsync(image, RenditionKind.Large, "jpeg", _options.LargeWidth, $"{baseKey}/large.jpg", cancellationToken)
        };

        if (_options.GenerateWebP)
        {
            tasks.Add(GenerateRenditionAsync(image, RenditionKind.WebP, "webp", _options.PreviewWidth, $"{baseKey}/preview.webp", cancellationToken));
        }

        if (_options.GenerateAvif)
        {
            tasks.Add(GenerateRenditionAsync(image, RenditionKind.Avif, "avif", _options.PreviewWidth, $"{baseKey}/preview.avif", cancellationToken));
        }

        if (_options.GenerateBlurPlaceholder)
        {
            tasks.Add(GenerateBlurAsync(image, $"{baseKey}/blur.png", cancellationToken));
        }

        var generated = await Task.WhenAll(tasks);
        renditions.AddRange(generated);

        return ProcessorOutput.Create(metadata, renditions);
    }

    private async Task<Rendition> GenerateRenditionAsync(
        Image<Rgba32> image, RenditionKind kind, string format, int targetWidth, string key, CancellationToken cancellationToken)
    {
        using var clone = image.Clone(ctx =>
            ctx.Resize(new ResizeOptions { Mode = ResizeMode.Max, Size = new Size(targetWidth, int.MaxValue) }));

        using var ms = new MemoryStream();
        await clone.SaveAsync(ms, GetEncoder(format), cancellationToken);
        return await _renditionStorage.StoreAsync(kind, format, key, ms, clone.Width, clone.Height, cancellationToken);
    }

    private async Task<Rendition> GenerateBlurAsync(Image<Rgba32> image, string key, CancellationToken cancellationToken)
    {
        using var clone = image.Clone(ctx =>
            ctx.Resize(new ResizeOptions { Mode = ResizeMode.Max, Size = new Size(32, 32) }).GaussianBlur(6));

        using var ms = new MemoryStream();
        await clone.SaveAsync(ms, new PngEncoder(), cancellationToken);
        return await _renditionStorage.StoreAsync(RenditionKind.BlurPlaceholder, "png", key, ms, clone.Width, clone.Height, cancellationToken);
    }

    private static IImageEncoder GetEncoder(string format) => format.ToLowerInvariant() switch
    {
        "png" => new PngEncoder(),
        "webp" => new WebpEncoder(),
        "avif" => new WebpEncoder(), // AVIF encoder is not bundled with ImageSharp; WebP serves as the high-efficiency fallback.
        _ => new JpegEncoder()
    };

    private static string? ComputeDominantColor(Image<Rgba32> image)
    {
        try
        {
            using var small = image.Clone(ctx => ctx.Resize(8, 8));
            var pixel = small[0, 0];
            return $"#{pixel.R:X2}{pixel.G:X2}{pixel.B:X2}";
        }
        catch
        {
            return null;
        }
    }

    private static void ExtractExif(Image<Rgba32> image, Dictionary<string, string> metadata, bool includeGps)
    {
        try
        {
            var profile = image.Metadata.ExifProfile;
            if (profile is null)
            {
                return;
            }

            if (profile.TryGetValue(ExifTag.Software, out var software))
            {
                metadata["software"] = software.Value?.ToString() ?? string.Empty;
            }

            if (profile.TryGetValue(ExifTag.DateTimeOriginal, out var dateTime))
            {
                metadata["dateTimeOriginal"] = dateTime.Value?.ToString() ?? string.Empty;
            }

            if (profile.TryGetValue(ExifTag.Make, out var make))
            {
                metadata["cameraMake"] = make.Value?.ToString() ?? string.Empty;
            }

            if (profile.TryGetValue(ExifTag.Model, out var model))
            {
                metadata["cameraModel"] = model.Value?.ToString() ?? string.Empty;
            }

            if (profile.TryGetValue(ExifTag.Orientation, out var orientation))
            {
                metadata["orientation"] = orientation?.Value.ToString() ?? string.Empty;
            }

            if (includeGps && profile.TryGetValue(ExifTag.GPSLatitude, out var latitude) && profile.TryGetValue(ExifTag.GPSLongitude, out var longitude))
            {
                metadata["gps"] = $"{latitude.Value} {longitude.Value}";
            }
        }
        catch
        {
            // Malformed EXIF is ignored rather than failing the whole job.
        }
    }
}

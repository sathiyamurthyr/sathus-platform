using System.Text;
using Microsoft.Extensions.Logging;
using Sathus.Media.Domain.ValueObjects;
using Sathus.Processing.Application.Interfaces;
using Sathus.Processing.Domain;
using Sathus.Processing.Domain.ValueObjects;
using Sathus.Processing.Infrastructure.Media;
using Sathus.Processing.Infrastructure.Services;

namespace Sathus.Processing.Infrastructure.Processors;

/// <summary>
/// Processes video assets. Extracts container, codec, duration, resolution, aspect
/// ratio and bitrate from real container parsing (MP4), and generates a poster frame
/// when an <see cref="IMediaTool"/> (ffmpeg) is available.
/// </summary>
public sealed class VideoProcessor : IAssetProcessor
{
    private readonly IAssetRenditionStorage _renditionStorage;
    private readonly IMediaTool _mediaTool;
    private readonly ILogger<VideoProcessor> _logger;

    public VideoProcessor(IAssetRenditionStorage renditionStorage, IMediaTool mediaTool, ILogger<VideoProcessor> logger)
    {
        _renditionStorage = renditionStorage;
        _mediaTool = mediaTool;
        _logger = logger;
    }

    public string Name => "VideoProcessor";

    public bool CanProcess(MediaType mediaType) => mediaType.Value == MediaType.Video.Value;

    public async Task<ProcessorOutput> ProcessAsync(ProcessingContext context, CancellationToken cancellationToken = default)
    {
        var metadata = new Dictionary<string, string>();
        var renditions = new List<Rendition>();
        var bytes = await ProcessorSupport.ReadAllBytesAsync(context.Source, cancellationToken);

        var container = DetectContainer(bytes);
        if (container is null)
        {
            throw new UnsupportedAssetException($"Unsupported video container for asset '{context.FileName}'.");
        }

        metadata["container"] = container;

        var duration = ParseMp4Duration(bytes);
        var (width, height, codec) = ParseMp4VideoTrack(bytes);

        if (duration.HasValue)
        {
            metadata["durationSeconds"] = duration.Value.ToString("F3");
        }

        if (width.HasValue && height.HasValue)
        {
            metadata["width"] = width.Value.ToString();
            metadata["height"] = height.Value.ToString();
            metadata["resolution"] = $"{width}x{height}";
            metadata["aspectRatio"] = (width.Value / (double)height.Value).ToString("F4");
        }

        if (!string.IsNullOrWhiteSpace(codec))
        {
            metadata["codec"] = codec;
        }

        if (duration.HasValue && context.FileSize > 0)
        {
            var bitrate = (context.FileSize * 8) / Math.Max(duration.Value, 0.001);
            metadata["bitrate"] = bitrate.ToString("F0");
        }

        if (_mediaTool.IsAvailable)
        {
            try
            {
                var frame = await _mediaTool.ExtractPosterAsync(context.Source, cancellationToken);
                if (frame is not null)
                {
                    using var ms = new MemoryStream(frame.Bytes);
                    var rendition = await _renditionStorage.StoreAsync(
                        RenditionKind.Poster, frame.Format, $"{ProcessorSupport.DeriveBaseKey(context.AssetId)}/poster.{frame.Format}", ms, frame.Width, frame.Height, cancellationToken);
                    renditions.Add(rendition);
                    metadata["hasPoster"] = "true";
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Poster extraction failed for {AssetId}", context.AssetId);
            }
        }

        return ProcessorOutput.Create(metadata, renditions);
    }

    private static string? DetectContainer(byte[] bytes)
    {
        // MP4 / MOV family start with an 'ftyp' box (major brand follows at offset 8).
        if (bytes.Length > 12 && Encoding.ASCII.GetString(bytes, 4, 4) == "ftyp")
        {
            return "mp4";
        }

        if (ProcessorSupport.StartsWith(bytes, "RIFF"u8.ToArray()) && bytes.Length > 12 && Encoding.ASCII.GetString(bytes, 8, 4) == "AVI ")
        {
            return "avi";
        }

        if (ProcessorSupport.StartsWith(bytes, "OggS"u8.ToArray()))
        {
            return "ogg";
        }

        if (ProcessorSupport.StartsWith(bytes, new byte[] { 0x1A, 0x45, 0xDF, 0x3A })) // Matroska / WebM EBML header
        {
            return "mkv";
        }

        return null;
    }

    private static double? ParseMp4Duration(byte[] bytes)
    {
        var idx = ProcessorSupport.IndexOf(bytes, "mvhd"u8.ToArray(), bytes.Length);
        if (idx < 0)
        {
            return null;
        }

        try
        {
            var boxStart = idx - 8;
            if (boxStart < 0 || boxStart + 28 > bytes.Length)
            {
                return null;
            }

            var version = bytes[boxStart + 8];
            uint timescale;
            ulong duration;
            if (version == 1)
            {
                timescale = ReadUInt32BE(bytes, boxStart + 20);
                duration = ReadUInt64BE(bytes, boxStart + 24);
            }
            else
            {
                timescale = ReadUInt32BE(bytes, boxStart + 12);
                duration = ReadUInt32BE(bytes, boxStart + 16);
            }

            if (timescale == 0)
            {
                return null;
            }

            return duration / (double)timescale;
        }
        catch
        {
            return null;
        }
    }

    private static (int? Width, int? Height, string? Codec) ParseMp4VideoTrack(byte[] bytes)
    {
        var codec = ParseMajorBrand(bytes);
        var idx = ProcessorSupport.IndexOf(bytes, "tkhd"u8.ToArray(), bytes.Length);
        if (idx < 0)
        {
            return (null, null, codec);
        }

        try
        {
            var boxStart = idx - 8;
            if (boxStart < 0 || boxStart + 92 > bytes.Length)
            {
                return (null, null, codec);
            }

            var version = bytes[boxStart + 8];
            int width, height;
            if (version == 1)
            {
                width = (int)(ReadUInt32BE(bytes, boxStart + 88) >> 16);
                height = (int)(ReadUInt32BE(bytes, boxStart + 92) >> 16);
            }
            else
            {
                width = (int)(ReadUInt32BE(bytes, boxStart + 76) >> 16);
                height = (int)(ReadUInt32BE(bytes, boxStart + 80) >> 16);
            }

            return (width, height, codec);
        }
        catch
        {
            return (null, null, codec);
        }
    }

    private static string? ParseMajorBrand(byte[] bytes)
    {
        if (bytes.Length <= 12)
        {
            return null;
        }

        try
        {
            return Encoding.ASCII.GetString(bytes, 8, 4);
        }
        catch
        {
            return null;
        }
    }

    private static uint ReadUInt32BE(byte[] data, int offset) =>
        (uint)(data[offset] << 24 | data[offset + 1] << 16 | data[offset + 2] << 8 | data[offset + 3]);

    private static ulong ReadUInt64BE(byte[] data, int offset) =>
        (ulong)ReadUInt32BE(data, offset) << 32 | ReadUInt32BE(data, offset + 4);
}

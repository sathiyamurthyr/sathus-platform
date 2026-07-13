using System.Diagnostics;
using Microsoft.Extensions.Logging;

namespace Sathus.Processing.Infrastructure.Media;

/// <summary>
/// A single decoded frame (used for video posters).
/// </summary>
public sealed record MediaFrame(byte[] Bytes, string Format, int Width, int Height);

/// <summary>
/// Abstraction over an external media tool (e.g. ffmpeg) used to derive posters and
/// probe metadata for video/audio assets. Implementations degrade gracefully when the
/// underlying tool is unavailable.
/// </summary>
public interface IMediaTool
{
    bool IsAvailable { get; }

    Task<MediaFrame?> ExtractPosterAsync(Stream stream, CancellationToken cancellationToken = default);

    Task<IReadOnlyDictionary<string, string>> ExtractProbeMetadataAsync(Stream stream, CancellationToken cancellationToken = default);
}

/// <summary>
/// Real ffmpeg integration. Detects ffmpeg on the PATH and shells out to extract a
/// poster frame. When ffmpeg is not installed the tool reports unavailable and the
/// processors skip poster generation.
/// </summary>
public sealed class FfmpegMediaTool : IMediaTool
{
    private readonly ILogger<FfmpegMediaTool> _logger;
    private readonly bool _available;

    public FfmpegMediaTool(ILogger<FfmpegMediaTool> logger)
    {
        _logger = logger;
        _available = ResolveFfmpeg();
    }

    public bool IsAvailable => _available;

    public async Task<MediaFrame?> ExtractPosterAsync(Stream stream, CancellationToken cancellationToken = default)
    {
        if (!_available)
        {
            return null;
        }

        try
        {
            var input = Path.GetTempFileName();
            var output = Path.ChangeExtension(Path.GetTempFileName(), ".png");

            try
            {
                await using (var file = File.Create(input))
                {
                    stream.Position = 0;
                    await stream.CopyToAsync(file, cancellationToken);
                }

                var startInfo = new ProcessStartInfo
                {
                    FileName = "ffmpeg",
                    Arguments = $"-y -i \"{input}\" -frames:v 1 -f image2 \"{output}\"",
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                using var process = Process.Start(startInfo)
                    ?? throw new InvalidOperationException("Failed to start ffmpeg.");

                await process.WaitForExitAsync(cancellationToken);
                if (process.ExitCode != 0 || !File.Exists(output))
                {
                    return null;
                }

                var bytes = await File.ReadAllBytesAsync(output, cancellationToken);
                return new MediaFrame(bytes, "png", 0, 0);
            }
            finally
            {
                if (File.Exists(input)) File.Delete(input);
                if (File.Exists(output)) File.Delete(output);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "ffmpeg poster extraction failed.");
            return null;
        }
    }

    public Task<IReadOnlyDictionary<string, string>> ExtractProbeMetadataAsync(Stream stream, CancellationToken cancellationToken = default)
    {
        return Task.FromResult<IReadOnlyDictionary<string, string>>(new Dictionary<string, string>());
    }

    private static bool ResolveFfmpeg()
    {
        try
        {
            var startInfo = new ProcessStartInfo
            {
                FileName = "ffmpeg",
                Arguments = "-version",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using var process = Process.Start(startInfo);
            if (process is null)
            {
                return false;
            }

            process.WaitForExit(3000);
            return process.ExitCode == 0;
        }
        catch
        {
            return false;
        }
    }
}

using System.Text;
using Microsoft.Extensions.Logging;
using Sathus.Media.Domain.ValueObjects;
using Sathus.Processing.Application.Interfaces;
using Sathus.Processing.Domain;
using Sathus.Processing.Domain.ValueObjects;

namespace Sathus.Processing.Infrastructure.Processors;

/// <summary>
/// Processes audio assets. Extracts codec, bitrate, sample rate, channel count and
/// duration using real container/frame parsing (MP3, WAV) and degrades to
/// container-only metadata for other formats.
/// </summary>
public sealed class AudioProcessor : IAssetProcessor
{
    private readonly ILogger<AudioProcessor> _logger;

    // bitrate (kbps) tables indexed by [version][layer][index] (index 0 is reserved)
    private static readonly int[][][] BitrateTable =
    {
        // MPEG 2.5
        new[] { new[] {0,32,48,56,64,80,96,112,128,144,160,176,192,224,256,0}, new[] {0,8,16,24,32,40,48,56,64,80,96,112,128,144,160,0}, new[] {0,8,16,24,32,40,48,56,64,80,96,112,128,144,160,0} },
        // reserved
        new[] { new[] {0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0}, new[] {0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0}, new[] {0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0} },
        // MPEG 2
        new[] { new[] {0,32,48,56,64,80,96,112,128,144,160,176,192,224,256,0}, new[] {0,8,16,24,32,40,48,56,64,80,96,112,128,144,160,0}, new[] {0,8,16,24,32,40,48,56,64,80,96,112,128,144,160,0} },
        // MPEG 1
        new[] { new[] {0,32,64,96,128,160,192,224,256,288,320,352,384,416,448,0}, new[] {0,32,48,56,64,80,96,112,128,160,192,224,256,320,384,0}, new[] {0,32,40,48,56,64,80,96,112,128,160,192,224,256,320,0} }
    };

    private static readonly int[][] SampleRateTable =
    {
        new[] { 11025, 12000, 8000, 0 },   // MPEG 2.5
        new[] { 0, 0, 0, 0 },             // reserved
        new[] { 22050, 24000, 16000, 0 }, // MPEG 2
        new[] { 44100, 48000, 32000, 0 }  // MPEG 1
    };

    public AudioProcessor(ILogger<AudioProcessor> logger)
    {
        _logger = logger;
    }

    public string Name => "AudioProcessor";

    public bool CanProcess(MediaType mediaType) => mediaType.Value == MediaType.Audio.Value;

    public async Task<ProcessorOutput> ProcessAsync(ProcessingContext context, CancellationToken cancellationToken = default)
    {
        var metadata = new Dictionary<string, string>();
        var bytes = await ProcessorSupport.ReadAllBytesAsync(context.Source, cancellationToken);

        if (ProcessorSupport.StartsWith(bytes, "ID3"u8.ToArray()) || (bytes.Length > 2 && bytes[0] == 0xFF && (bytes[1] & 0xE0) == 0xE0))
        {
            ParseMp3(bytes, context, metadata);
        }
        else if (ProcessorSupport.StartsWith(bytes, "RIFF"u8.ToArray()) && bytes.Length > 12 && Encoding.ASCII.GetString(bytes, 8, 4) == "WAVE")
        {
            ParseWav(bytes, context, metadata);
        }
        else if (ProcessorSupport.StartsWith(bytes, "fLaC"u8.ToArray()))
        {
            metadata["codec"] = "flac";
        }
        else if (ProcessorSupport.StartsWith(bytes, "OggS"u8.ToArray()))
        {
            metadata["codec"] = "vorbis";
        }
        else if (bytes.Length > 12 && Encoding.ASCII.GetString(bytes, 4, 4) == "ftyp")
        {
            metadata["codec"] = Encoding.ASCII.GetString(bytes, 8, 4);
        }
        else
        {
            throw new UnsupportedAssetException($"Unsupported audio container for asset '{context.FileName}'.");
        }

        return ProcessorOutput.Create(metadata, new List<Rendition>());
    }

    private static void ParseMp3(byte[] bytes, ProcessingContext context, Dictionary<string, string> metadata)
    {
        var offset = 0;
        if (bytes.Length > 2 && bytes[0] == 0x49 && bytes[1] == 0x44 && bytes[2] == 0x33) // ID3v2
        {
            offset = SkipId3V2(bytes);
        }

        var headerIndex = FindMp3Frame(bytes, offset);
        if (headerIndex < 0)
        {
            metadata["codec"] = "mp3";
            return;
        }

        var b1 = bytes[headerIndex + 1];
        var b2 = bytes[headerIndex + 2];

        var versionBits = (b1 >> 3) & 0x03;
        var layerBits = (b1 >> 1) & 0x03;
        var bitrateIndex = (b2 >> 4) & 0x0F;
        var sampleRateIndex = (b2 >> 2) & 0x03;
        var padding = (b2 >> 1) & 0x01;
        var channelMode = bytes[headerIndex + 3] >> 6;

        var version = versionBits switch
        {
            0 => 3, // MPEG 2.5
            2 => 2, // MPEG 2
            3 => 0, // MPEG 1
            _ => 1
        };
        var layer = layerBits switch
        {
            1 => 2, // Layer III
            2 => 1, // Layer II
            3 => 0, // Layer I
            _ => -1
        };

        var versionName = versionBits switch { 0 => "2.5", 2 => "2", 3 => "1", _ => "reserved" };
        var layerName = layerBits switch { 1 => "III", 2 => "II", 3 => "I", _ => "reserved" };
        metadata["codec"] = $"mp3";
        metadata["mpegVersion"] = versionName;
        metadata["layer"] = layerName;

        if (layer < 0 || bitrateIndex == 0 || bitrateIndex == 15)
        {
            return;
        }

        var bitrate = BitrateTable[version][layer][bitrateIndex];
        var sampleRate = SampleRateTable[version][sampleRateIndex];
        if (bitrate == 0 || sampleRate == 0)
        {
            return;
        }

        metadata["bitrate"] = bitrate.ToString();
        metadata["sampleRate"] = sampleRate.ToString();
        metadata["channels"] = channelMode == 3 ? "1" : "2";

        if (context.FileSize > 0)
        {
            var durationSeconds = context.FileSize / (double)(bitrate * 1000 / 8);
            metadata["durationSeconds"] = durationSeconds.ToString("F3");
        }
    }

    private static int SkipId3V2(byte[] bytes)
    {
        if (bytes.Length < 10)
        {
            return 0;
        }

        var size = ((bytes[6] & 0x7F) << 21) | ((bytes[7] & 0x7F) << 14) | ((bytes[8] & 0x7F) << 7) | (bytes[9] & 0x7F);
        return 10 + size;
    }

    private static int FindMp3Frame(byte[] bytes, int offset)
    {
        for (var i = offset; i < bytes.Length - 4; i++)
        {
            if (bytes[i] == 0xFF && (bytes[i + 1] & 0xE0) == 0xE0 && (bytes[i + 1] & 0x06) != 0)
            {
                return i;
            }
        }

        return -1;
    }

    private static void ParseWav(byte[] bytes, ProcessingContext context, Dictionary<string, string> metadata)
    {
        metadata["codec"] = "wav";
        var pos = 12;
        while (pos + 8 <= bytes.Length)
        {
            var chunkId = Encoding.ASCII.GetString(bytes, pos, 4);
            var chunkSize = ReadUInt32LE(bytes, pos + 4);
            var body = pos + 8;

            if (chunkId == "fmt ")
            {
                var audioFormat = ReadUInt16LE(bytes, body);
                var channels = ReadUInt16LE(bytes, body + 2);
                var sampleRate = ReadUInt32LE(bytes, body + 4);
                var byteRate = ReadUInt32LE(bytes, body + 8);
                var bitsPerSample = ReadUInt16LE(bytes, body + 14);

                metadata["audioFormat"] = audioFormat == 1 ? "pcm" : audioFormat.ToString();
                metadata["channels"] = channels.ToString();
                metadata["sampleRate"] = sampleRate.ToString();
                metadata["bitsPerSample"] = bitsPerSample.ToString();
                if (byteRate > 0 && context.FileSize > 0)
                {
                    metadata["durationSeconds"] = (context.FileSize / (double)byteRate).ToString("F3");
                }
            }
            else if (chunkId == "data")
            {
                if (context.FileSize > 0 && bytes.Length > body)
                {
                    metadata["dataBytes"] = chunkSize.ToString();
                }
            }

            pos = (int)(body + chunkSize);
            if (chunkSize % 2 == 1)
            {
                pos++;
            }
        }
    }

    private static int ReadUInt16LE(byte[] data, int offset) =>
        data[offset] | (data[offset + 1] << 8);

    private static uint ReadUInt32LE(byte[] data, int offset) =>
        (uint)(data[offset] | (data[offset + 1] << 8) | (data[offset + 2] << 16) | (data[offset + 3] << 24));
}

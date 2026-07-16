using System.Text;

namespace Sathus.Processing.Infrastructure.Processors;

internal static class ProcessorSupport
{
    public static async Task<byte[]> ReadAllBytesAsync(Stream stream, CancellationToken cancellationToken = default)
    {
        if (stream.CanSeek)
        {
            stream.Position = 0;
        }

        using var output = new MemoryStream();
        await stream.CopyToAsync(output, cancellationToken);
        return output.ToArray();
    }

    public static bool StartsWith(byte[] data, ReadOnlySpan<byte> signature)
    {
        if (data.Length < signature.Length)
        {
            return false;
        }

        for (var i = 0; i < signature.Length; i++)
        {
            if (data[i] != signature[i])
            {
                return false;
            }
        }

        return true;
    }

    public static bool ContainsAscii(byte[] data, string value, int maxScan = 4096)
    {
        var ascii = Encoding.ASCII.GetBytes(value);
        var limit = Math.Min(data.Length, maxScan);
        return IndexOf(data, ascii, limit) >= 0;
    }

    public static int IndexOf(byte[] data, byte[] pattern, int limit)
    {
        for (var i = 0; i <= limit - pattern.Length; i++)
        {
            var match = true;
            for (var j = 0; j < pattern.Length; j++)
            {
                if (data[i + j] != pattern[j])
                {
                    match = false;
                    break;
                }
            }

            if (match)
            {
                return i;
            }
        }

        return -1;
    }

    public static string DeriveBaseKey(Guid assetId) => $"processing/{assetId}";
}

namespace Sathus.Media.Domain.ValueObjects;

/// <summary>
/// File size in bytes with an upper-bound guard. Maps to an EF owned type.
/// </summary>
public sealed record FileSize
{
    public long Bytes { get; set; }

    public const long MaxBytes = 10L * 1024 * 1024 * 1024; // 10 GiB

    public FileSize()
    {
    }

    private FileSize(long bytes) => Bytes = bytes;

    public static FileSize Create(long bytes)
    {
        if (bytes <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(bytes), "File size must be greater than zero.");
        }

        if (bytes > MaxBytes)
        {
            throw new ArgumentOutOfRangeException(nameof(bytes), $"File size exceeds the maximum of {MaxBytes} bytes.");
        }

        return new FileSize { Bytes = bytes };
    }

    public double Kilobytes => Bytes / 1024d;

    public double Megabytes => Bytes / (1024d * 1024);

    public override string ToString() => $"{Bytes} bytes";
}

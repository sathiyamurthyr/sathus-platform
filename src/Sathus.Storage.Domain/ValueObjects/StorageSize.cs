using System;

namespace Sathus.Storage.Domain.ValueObjects;

public readonly record struct StorageSize(long Value, string Unit)
{
    public static readonly StorageSize Zero = new(0, "bytes");

    private static readonly string[] Units = { "bytes", "KB", "MB", "GB", "TB", "PB" };

    public static StorageSize Create(long bytes)
    {
        if (bytes < 0)
            throw new ArgumentOutOfRangeException(nameof(bytes), "Storage size cannot be negative.");

        return new StorageSize(bytes, "bytes");
    }

    public static StorageSize FromBytes(long bytes)
    {
        return Create(bytes);
    }

    public double ToKilobytes() => Value / 1024.0;
    public double ToMegabytes() => Value / 1024.0 / 1024.0;
    public double ToGigabytes() => Value / 1024.0 / 1024.0 / 1024.0;

    public string ToHumanReadable()
    {
        if (Value == 0)
            return "0 bytes";

        var size = (double)Value;
        var unitIndex = 0;

        while (size >= 1024 && unitIndex < Units.Length - 1)
        {
            size /= 1024;
            unitIndex++;
        }

        return unitIndex == 0 ? $"{size} {Units[unitIndex]}" : $"{size:F2} {Units[unitIndex]}";
    }

    public static StorageSize operator +(StorageSize left, StorageSize right)
    {
        if (!left.Unit.Equals(right.Unit, StringComparison.OrdinalIgnoreCase))
            throw new InvalidOperationException("Cannot add storage sizes with different units.");

        return new StorageSize(left.Value + right.Value, left.Unit);
    }

    public static implicit operator long(StorageSize size) => size.Value;
    public override string ToString() => $"{Value} {Unit}";
}

namespace Sathus.Media.Domain.ValueObjects;

/// <summary>
/// Playback duration for audio and video assets. Maps to an EF owned type.
/// </summary>
public sealed record Duration
{
    public TimeSpan Value { get; set; }

    public Duration()
    {
    }

    private Duration(TimeSpan value) => Value = value;

    public static Duration Create(TimeSpan value)
    {
        if (value <= TimeSpan.Zero)
        {
            throw new ArgumentOutOfRangeException(nameof(value), "Duration must be greater than zero.");
        }

        if (value.TotalDays > 7)
        {
            throw new ArgumentOutOfRangeException(nameof(value), "Duration cannot exceed seven days.");
        }

        return new Duration { Value = value };
    }

    public static Duration? FromSeconds(double seconds)
    {
        if (seconds <= 0)
        {
            return null;
        }

        return Create(TimeSpan.FromSeconds(seconds));
    }

    public double TotalSeconds => Value.TotalSeconds;

    public override string ToString() => Value.ToString(@"hh\:mm\:ss");
}

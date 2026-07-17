namespace Sathus.Media.Domain.ValueObjects;

/// <summary>
/// Strongly-typed identifier for a media asset.
/// </summary>
public sealed record MediaId(Guid Value)
{
    public static MediaId New() => new(Guid.NewGuid());

    public static MediaId From(Guid value)
    {
        if (value == Guid.Empty)
        {
            throw new ArgumentException("MediaId cannot be empty.", nameof(value));
        }

        return new MediaId(value);
    }

    public override string ToString() => Value.ToString();
}

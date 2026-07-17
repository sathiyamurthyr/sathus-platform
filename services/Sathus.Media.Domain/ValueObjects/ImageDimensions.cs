namespace Sathus.Media.Domain.ValueObjects;

/// <summary>
/// Pixel dimensions for image (and some video) assets. Maps to an EF owned type.
/// </summary>
public sealed record ImageDimensions
{
    public int Width { get; set; }

    public int Height { get; set; }

    public ImageDimensions()
    {
    }

    private ImageDimensions(int width, int height)
    {
        Width = width;
        Height = height;
    }

    public static ImageDimensions Create(int width, int height)
    {
        if (width <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(width), "Width must be greater than zero.");
        }

        if (height <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(height), "Height must be greater than zero.");
        }

        return new ImageDimensions { Width = width, Height = height };
    }

    public double AspectRatio => Width / (double)Height;

    public override string ToString() => $"{Width}x{Height}";
}

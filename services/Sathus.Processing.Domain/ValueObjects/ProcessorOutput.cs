using System.Collections.Generic;

namespace Sathus.Processing.Domain.ValueObjects;

/// <summary>
/// Result returned by an <see cref="Interfaces.IAssetProcessor"/>. Carries the
/// extracted metadata plus any generated renditions (thumbnails, derivatives,
/// blur placeholder) that are persisted back to storage by the pipeline.
/// </summary>
public sealed record ProcessorOutput
{
    public IReadOnlyDictionary<string, string> Metadata { get; init; } = new Dictionary<string, string>();
    public IReadOnlyList<Rendition> Renditions { get; init; } = new List<Rendition>();

    public static ProcessorOutput Empty { get; } = new();

    public static ProcessorOutput Create(
        IReadOnlyDictionary<string, string>? metadata = null,
        IReadOnlyList<Rendition>? renditions = null) =>
        new()
        {
            Metadata = metadata ?? new Dictionary<string, string>(),
            Renditions = renditions ?? new List<Rendition>()
        };

    public IReadOnlyList<Rendition> Thumbnails =>
        Renditions.Where(r => Rendition.ThumbnailKinds.Contains(r.Kind)).ToList();

    public Rendition? BlurPlaceholder =>
        Renditions.FirstOrDefault(r => r.Kind == RenditionKind.BlurPlaceholder);
}

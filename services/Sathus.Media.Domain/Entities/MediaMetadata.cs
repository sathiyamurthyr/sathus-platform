using Sathus.Media.Domain.ValueObjects;
using Sathus.SharedKernel.Entities;

namespace Sathus.Media.Domain.Entities;

/// <summary>
/// A single key/value metadata entry attached to an asset, optionally localized.
/// </summary>
public sealed class MediaMetadata : Entity
{
    public Guid AssetId { get; private set; }
    public string Key { get; private set; } = string.Empty;
    public string Value { get; private set; } = string.Empty;
    public LanguageCode? Language { get; private set; }

    public MediaAsset? Asset { get; set; }

    private MediaMetadata()
    {
    }

    public MediaMetadata(Guid assetId, string key, string value, LanguageCode? language = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        ArgumentNullException.ThrowIfNull(value);

        Id = Guid.NewGuid();
        AssetId = assetId;
        Key = key.Trim();
        Value = value;
        Language = language;
        SetCreationAudit(null, DateTime.UtcNow);
    }

    public void UpdateValue(string value, Guid? updatedBy)
    {
        ArgumentNullException.ThrowIfNull(value);
        Value = value;
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }
}

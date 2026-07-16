namespace Sathus.MediaRelations.Domain;

/// <summary>
/// Permission constants for the Asset Relationship &amp; Usage Engine.
/// </summary>
public static class MediaRelationPermissions
{
    public const string UsageRead = "media.usage.read";
    public const string UsageManage = "media.usage.manage";
    public const string ReferenceValidate = "media.reference.validate";

    public static IReadOnlyList<string> All { get; } = new[]
    {
        UsageRead,
        UsageManage,
        ReferenceValidate
    };
}

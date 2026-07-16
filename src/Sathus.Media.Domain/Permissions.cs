namespace Sathus.Media.Domain;

/// <summary>
/// Claims-based permissions for the media bounded context. Used to build authorization
/// policies; never reference roles directly.
/// </summary>
public static class MediaPermissions
{
    public const string Read = "media.read";
    public const string Create = "media.create";
    public const string Update = "media.update";
    public const string Delete = "media.delete";
    public const string Restore = "media.restore";
    public const string Archive = "media.archive";

    public static IReadOnlyList<string> All { get; } = new[]
    {
        Read,
        Create,
        Update,
        Delete,
        Restore,
        Archive
    };
}

namespace Sathus.Storage.Domain;

public static class Permissions
{
    public const string StorageRead = "storage.read";
    public const string StorageConfigure = "storage.configure";
    public const string StorageHealth = "storage.health";
    public const string StorageProviders = "storage.providers";

    public static IReadOnlyList<string> All { get; } = new[]
    {
        StorageRead,
        StorageConfigure,
        StorageHealth,
        StorageProviders
    };
}

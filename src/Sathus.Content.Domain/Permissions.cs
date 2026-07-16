namespace Sathus.Content.Domain;

public static class Permissions
{
    public const string ContentRead = "content.read";
    public const string ContentWrite = "content.write";
    public const string ContentManage = "content.manage";

    public static IReadOnlyList<string> All { get; } = new[]
    {
        ContentRead,
        ContentWrite,
        ContentManage
    };
}

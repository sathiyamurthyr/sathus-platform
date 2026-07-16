namespace Sathus.Processing.Domain;

/// <summary>
/// Claims-based permissions for the processing bounded context. Policies are built
/// from these; roles are never referenced directly.
/// </summary>
public static class ProcessingPermissions
{
    public const string Read = "processing.read";
    public const string Retry = "processing.retry";
    public const string Manage = "processing.manage";

    public static IReadOnlyList<string> All { get; } = new[]
    {
        Read,
        Retry,
        Manage
    };
}

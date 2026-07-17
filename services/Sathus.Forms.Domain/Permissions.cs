namespace Sathus.Forms.Domain;

/// <summary>
/// Claims-based permissions for the Forms &amp; Workflow bounded context. Built into
/// authorization policies; never reference roles directly.
/// </summary>
public static class FormsPermissions
{
    public const string Read = "forms.read";
    public const string Create = "forms.create";
    public const string Update = "forms.update";
    public const string Publish = "forms.publish";
    public const string Submit = "forms.submit";
    public const string Review = "forms.review";
    public const string Export = "forms.export";

    public static IReadOnlyList<string> All { get; } = new[]
    {
        Read,
        Create,
        Update,
        Publish,
        Submit,
        Review,
        Export
    };
}

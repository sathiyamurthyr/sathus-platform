namespace Sathus.Navigation.Domain.Enums;

/// <summary>
/// External content the navigation item links to. Drives automated broken-reference detection
/// against the Content Engine, DAM and other Sathus services.
/// </summary>
public enum ReferenceKind
{
    None = 0,
    Page = 1,
    Product = 2,
    Document = 3,
    Blog = 4,
    Learning = 5,
    Media = 6,
    External = 7
}

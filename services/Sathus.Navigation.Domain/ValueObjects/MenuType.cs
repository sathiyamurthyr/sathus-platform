namespace Sathus.Navigation.Domain.ValueObjects;

/// <summary>
/// Menu type. Backed by a string so that future menu types can be configured without
/// recompilation. A fixed set of well-known types is provided for discoverability.
/// </summary>
public sealed record MenuType
{
    public string Value { get; }

    public const int MaxLength = 64;

    public static readonly MenuType Main = new("main");
    public static readonly MenuType Footer = new("footer");
    public static readonly MenuType Sidebar = new("sidebar");
    public static readonly MenuType Documentation = new("documentation");
    public static readonly MenuType Learning = new("learning");
    public static readonly MenuType Product = new("product");
    public static readonly MenuType Portal = new("portal");
    public static readonly MenuType Mobile = new("mobile");
    public static readonly MenuType ContextMenu = new("context-menu");
    public static readonly MenuType Breadcrumb = new("breadcrumb");

    public static IReadOnlyList<MenuType> WellKnown { get; } = new[]
    {
        Main, Footer, Sidebar, Documentation, Learning, Product, Portal, Mobile, ContextMenu, Breadcrumb
    };

    private MenuType(string value) => Value = value;

    public static MenuType Create(string? raw)
    {
        if (string.IsNullOrWhiteSpace(raw))
        {
            throw new ArgumentException("Menu type is required.", nameof(raw));
        }

        var trimmed = raw.Trim().ToLowerInvariant();
        if (trimmed.Length > MaxLength)
        {
            throw new ArgumentException($"Menu type must be at most {MaxLength} characters.", nameof(raw));
        }

        if (!System.Text.RegularExpressions.Regex.IsMatch(trimmed, "^[a-z0-9\\-]+$"))
        {
            throw new ArgumentException("Menu type must be lower-case alphanumeric with hyphens.", nameof(raw));
        }

        return new MenuType(trimmed);
    }

    public bool IsWellKnown => WellKnown.Any(t => t.Value == Value);

    public override string ToString() => Value;
}

using Sathus.Navigation.Domain.Enums;

namespace Sathus.Navigation.Domain.Entities;

/// <summary>
/// A redirect rule for a menu (permanent, temporary or canonical).
/// </summary>
public sealed class NavigationRedirect : Entity
{
    public Guid TreeId { get; private set; }

    public Guid MenuId { get; private set; }

    public string SourcePath { get; private set; } = string.Empty;

    public string TargetPath { get; private set; } = string.Empty;

    public RedirectType RedirectType { get; private set; }

    public string Locale { get; private set; } = "en";

    public int Priority { get; private set; }

    public bool IsEnabled { get; private set; } = true;

    private NavigationRedirect()
    {
    }

    public static NavigationRedirect Create(
        Guid treeId,
        Guid menuId,
        string sourcePath,
        string targetPath,
        RedirectType redirectType,
        string? locale = null,
        int priority = 0,
        bool isEnabled = true)
    {
        return new NavigationRedirect
        {
            Id = Guid.NewGuid(),
            TreeId = treeId,
            MenuId = menuId,
            SourcePath = sourcePath,
            TargetPath = targetPath,
            RedirectType = redirectType,
            Locale = locale ?? "en",
            Priority = priority,
            IsEnabled = isEnabled
        };
    }

    public void SetEnabled(bool enabled) => IsEnabled = enabled;

    public void SetPriority(int priority) => Priority = priority;
}

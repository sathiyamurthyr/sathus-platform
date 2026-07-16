using Sathus.Navigation.Domain.Enums;
using Sathus.Navigation.Domain.Events;
using Sathus.Navigation.Domain.Exceptions;
using Sathus.Navigation.Domain.ValueObjects;

namespace Sathus.Navigation.Domain.Entities;

/// <summary>
/// Aggregate root representing a navigation structure for a Sathus platform. Owns menus,
/// redirects, localizations and the history ledger. This is the navigation engine's primary
/// consistency boundary.
/// </summary>
public sealed class NavigationTree : AggregateRoot
{
    public Platform Platform { get; private set; }

    public string Name { get; private set; } = string.Empty;

    public string DefaultLocale { get; private set; } = "en";

    public string? Description { get; private set; }

    public MenuStatus Status { get; private set; } = MenuStatus.Draft;

    public ICollection<NavigationMenu> Menus { get; } = new List<NavigationMenu>();

    public ICollection<NavigationRedirect> Redirects { get; } = new List<NavigationRedirect>();

    public ICollection<NavigationHistory> History { get; } = new List<NavigationHistory>();

    public TreeId TreeId => new(Id);

    private NavigationTree()
    {
    }

    public static NavigationTree Create(
        Platform platform,
        string name,
        string defaultLocale,
        string? description = null,
        Guid? createdBy = null)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Tree name is required.", nameof(name));
        }

        var tree = new NavigationTree
        {
            Id = Guid.NewGuid(),
            Platform = platform,
            Name = name.Trim(),
            DefaultLocale = (defaultLocale ?? "en").ToLowerInvariant(),
            Description = description,
            Status = MenuStatus.Draft
        };
        tree.SetCreationAudit(createdBy, DateTime.UtcNow);
        tree.AddDomainEvent(new NavigationTreeCreatedEvent(tree.Id));
        return tree;
    }

    public void Rename(string name, Guid? updatedBy)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Tree name is required.", nameof(name));
        }

        Name = name.Trim();
        SetUpdateAudit(updatedBy, DateTime.UtcNow);
    }

    public NavigationMenu AddMenu(string name, MenuType menuType, string? locale = null, Guid? createdBy = null)
    {
        var menu = NavigationMenu.Create(Id, name, menuType, locale ?? DefaultLocale, createdBy);
        Menus.Add(menu);
        AddDomainEvent(new NavigationMenuCreatedEvent(Id, menu.Id));
        return menu;
    }

    public void RemoveMenu(Guid menuId)
    {
        var menu = Menus.FirstOrDefault(m => m.Id == menuId)
            ?? throw new NavigationMenuNotFoundException(menuId);
        Menus.Remove(menu);
    }

    public NavigationMenu GetMenu(Guid menuId) =>
        Menus.FirstOrDefault(m => m.Id == menuId) ?? throw new NavigationMenuNotFoundException(menuId);

    public NavigationRedirect AddRedirect(
        Guid menuId,
        string sourcePath,
        string targetPath,
        RedirectType redirectType,
        string? locale = null,
        int priority = 0,
        bool isEnabled = true)
    {
        GetMenu(menuId);
        var redirect = NavigationRedirect.Create(Id, menuId, sourcePath, targetPath, redirectType, locale, priority, isEnabled);
        Redirects.Add(redirect);
        return redirect;
    }

    public void RemoveRedirect(Guid redirectId)
    {
        var redirect = Redirects.FirstOrDefault(r => r.Id == redirectId)
            ?? throw new NavigationInvalidOperationException($"Redirect '{redirectId}' was not found.");
        Redirects.Remove(redirect);
    }

    public void Archive(Guid? actorId)
    {
        if (Status == MenuStatus.Archived)
        {
            return;
        }

        Status = MenuStatus.Archived;
        SetUpdateAudit(actorId, DateTime.UtcNow);
    }

    public void Restore(Guid? actorId)
    {
        if (Status != MenuStatus.Archived)
        {
            return;
        }

        Status = MenuStatus.Draft;
        SetUpdateAudit(actorId, DateTime.UtcNow);
    }

    public void RecordHistory(
        HistoryOperation operation,
        Guid? menuId = null,
        Guid? actorId = null,
        string? payload = null,
        Guid? versionId = null)
    {
        History.Add(NavigationHistory.Create(Id, operation, menuId, actorId, payload, versionId));
    }
}

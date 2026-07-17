namespace Sathus.Navigation.Api.Requests;

public sealed record CreateTreeRequest(string Platform, string Name, string DefaultLocale, string? Description = null);

public sealed record RenameTreeRequest(string Name);

public sealed record RollbackRequest(Guid VersionId);

public sealed record CreateMenuRequest(Guid TreeId, string Name, string MenuType, string? Locale = null);

public sealed record CloneMenuRequest(string? NewName = null, string? Locale = null);

public sealed record CreateNodeRequest(
    Guid? ParentId,
    string DisplayName,
    string ItemType,
    string? RoutePath = null,
    string TargetType = "Internal",
    string? TargetUrl = null,
    string ReferenceKind = "None",
    Guid? ReferenceId = null,
    string? Icon = null,
    string? CssClass = null,
    bool IsExpanded = false,
    bool IsHidden = false,
    bool IsEnabled = true);

public sealed record UpdateNodeRequest(
    string DisplayName,
    string ItemType,
    string? RoutePath = null,
    string TargetType = "Internal",
    string? TargetUrl = null,
    string ReferenceKind = "None",
    Guid? ReferenceId = null,
    string? Icon = null,
    string? CssClass = null,
    bool IsExpanded = false,
    bool IsHidden = false,
    bool IsEnabled = true);

public sealed record MoveNodeRequest(Guid? NewParentId, int NewOrder);

public sealed record CopyNodeRequest(Guid? NewParentId);

public sealed record SetLocalizationRequest(string LanguageCode, string DisplayName, string? RoutePath = null, bool IsFallback = false);

public sealed record SetPermissionsRequest(IReadOnlyList<PermissionDto> Permissions);

public sealed record CreateVersionRequest(string Label);

public sealed record SchedulePublishRequest(DateTime ScheduledAt);

public sealed record RollbackMenuRequest(Guid VersionId);

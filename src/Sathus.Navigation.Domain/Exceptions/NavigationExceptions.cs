using Sathus.SharedKernel.Exceptions;

namespace Sathus.Navigation.Domain.Exceptions;

public sealed class NavigationTreeNotFoundException : AppException
{
    public NavigationTreeNotFoundException(Guid treeId)
        : base($"Navigation tree '{treeId}' was not found.") => TreeId = treeId;

    public Guid TreeId { get; }
}

public sealed class NavigationMenuNotFoundException : AppException
{
    public NavigationMenuNotFoundException(Guid menuId)
        : base($"Navigation menu '{menuId}' was not found.") => MenuId = menuId;

    public Guid MenuId { get; }
}

public sealed class NavigationNodeNotFoundException : AppException
{
    public NavigationNodeNotFoundException(Guid nodeId)
        : base($"Navigation node '{nodeId}' was not found.") => NodeId = nodeId;

    public Guid NodeId { get; }
}

public sealed class NavigationVersionNotFoundException : AppException
{
    public NavigationVersionNotFoundException(Guid versionId)
        : base($"Navigation version '{versionId}' was not found.") => VersionId = versionId;

    public Guid VersionId { get; }
}

public sealed class NavigationCircularReferenceException : AppException
{
    public NavigationCircularReferenceException(string message) : base(message)
    {
    }
}

public sealed class NavigationInvalidOperationException : AppException
{
    public NavigationInvalidOperationException(string message) : base(message)
    {
    }
}

public sealed class NavigationDuplicateRouteException : AppException
{
    public NavigationDuplicateRouteException(string route)
        : base($"Route '{route}' is already in use within the menu.") => Route = route;

    public string Route { get; }
}

public sealed class NavigationBrokenReferenceException : AppException
{
    public NavigationBrokenReferenceException(string message) : base(message)
    {
    }
}

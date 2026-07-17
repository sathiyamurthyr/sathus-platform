using Sathus.Navigation.Domain.Entities;
using Sathus.SharedKernel.Specifications;

namespace Sathus.Navigation.Application.Specifications;

public sealed class NavigationTreeByPlatformSpecification : Specification<NavigationTree>
{
    public NavigationTreeByPlatformSpecification(Platform? platform)
    {
        if (platform is not null)
        {
            AddCriteria(t => t.Platform == platform.Value);
        }

        AddInclude(t => t.Menus);
        ApplyOrderByDescending(t => t.CreatedAt);
    }
}

public sealed class MenuByTypeSpecification : Specification<NavigationMenu>
{
    public MenuByTypeSpecification(Guid treeId, string menuType, string? locale = null)
    {
        AddCriteria(m => m.TreeId == treeId && m.MenuTypeValue == menuType);
        if (!string.IsNullOrWhiteSpace(locale))
        {
            AddCriteria(m => m.Locale == locale);
        }

        ApplyOrderByDescending(m => m.CreatedAt);
    }
}

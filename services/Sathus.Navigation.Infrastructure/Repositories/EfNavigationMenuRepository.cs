using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Sathus.Navigation.Application.Interfaces;
using Sathus.Navigation.Domain.Entities;
using Sathus.SharedKernel.Repositories;

namespace Sathus.Navigation.Infrastructure.Repositories;

public sealed class EfNavigationMenuRepository : EfRepository<NavigationMenu>, INavigationMenuRepository
{
    private readonly NavigationDbContext _dbContext;

    public EfNavigationMenuRepository(NavigationDbContext dbContext, IMediator mediator) : base(dbContext, mediator)
    {
        _dbContext = dbContext;
    }

    public async Task<NavigationMenu?> GetWithNodesAsync(Guid menuId, CancellationToken cancellationToken = default) =>
        await _dbContext.NavigationMenus
            .Include(m => m.Nodes)
            .ThenInclude(n => n.Children)
            .Include(m => m.Versions)
            .Include(m => m.Items)
            .Include(m => m.Routes)
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.Id == menuId, cancellationToken);

    public async Task<IReadOnlyList<NavigationItem>> GetItemsAsync(Guid menuId, Guid versionId, CancellationToken cancellationToken = default) =>
        await _dbContext.NavigationItems
            .AsNoTracking()
            .Where(i => i.MenuId == menuId && i.VersionId == versionId)
            .OrderBy(i => i.Depth)
            .ThenBy(i => i.SortOrder)
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<NavigationVersion>> GetVersionsAsync(Guid menuId, CancellationToken cancellationToken = default) =>
        await _dbContext.NavigationVersions
            .AsNoTracking()
            .Where(v => v.MenuId == menuId)
            .OrderByDescending(v => v.VersionNumber)
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<NavigationRedirect>> GetRedirectsAsync(Guid menuId, CancellationToken cancellationToken = default)
    {
        var menu = await _dbContext.NavigationMenus.AsNoTracking().FirstOrDefaultAsync(m => m.Id == menuId, cancellationToken);
        if (menu is null)
        {
            return Array.Empty<NavigationRedirect>();
        }

        return await _dbContext.NavigationRedirects
            .AsNoTracking()
            .Where(r => r.TreeId == menu.TreeId)
            .ToListAsync(cancellationToken);
    }
}

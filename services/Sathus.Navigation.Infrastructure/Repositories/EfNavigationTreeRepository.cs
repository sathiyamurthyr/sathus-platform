using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Sathus.Navigation.Domain.Entities;
using Sathus.Navigation.Domain.Enums;
using Sathus.Navigation.Application.Interfaces;
using Sathus.SharedKernel.Repositories;

namespace Sathus.Navigation.Infrastructure.Repositories;

public sealed class EfNavigationTreeRepository : EfRepository<NavigationTree>, INavigationTreeRepository
{
    private readonly NavigationDbContext _dbContext;

    public EfNavigationTreeRepository(NavigationDbContext dbContext, IMediator mediator) : base(dbContext, mediator)
    {
        _dbContext = dbContext;
    }

    public async Task<NavigationTree?> GetWithMenusAsync(Guid treeId, CancellationToken cancellationToken = default) =>
        await _dbContext.NavigationTrees
            .Include(t => t.Menus)
            .Include(t => t.Redirects)
            .Include(t => t.History)
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == treeId, cancellationToken);

    public async Task<NavigationMenu?> GetMenuAsync(Guid menuId, CancellationToken cancellationToken = default) =>
        await _dbContext.NavigationMenus
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.Id == menuId, cancellationToken);

    public async Task<IReadOnlyList<NavigationMenu>> GetMenusAsync(Guid treeId, CancellationToken cancellationToken = default) =>
        await _dbContext.NavigationMenus
            .AsNoTracking()
            .Where(m => m.TreeId == treeId)
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<NavigationTree>> ListByPlatformAsync(Platform? platform, CancellationToken cancellationToken = default)
    {
        var query = _dbContext.NavigationTrees.AsNoTracking().AsQueryable();
        if (platform is not null)
        {
            query = query.Where(t => t.Platform == platform.Value);
        }

        return await query.OrderByDescending(t => t.CreatedAt).ToListAsync(cancellationToken);
    }

    public async Task<bool> RouteExistsAsync(Guid menuId, string routePath, Guid? exceptNodeId = null, CancellationToken cancellationToken = default)
    {
        var q = _dbContext.NavigationNodes.AsNoTracking().Where(n => n.MenuId == menuId && n.RoutePath == routePath);
        if (exceptNodeId is not null)
        {
            q = q.Where(n => n.Id != exceptNodeId.Value);
        }

        return await q.AnyAsync(cancellationToken);
    }
}

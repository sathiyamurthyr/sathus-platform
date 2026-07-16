namespace Sathus.Identity.Infrastructure.Repositories;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Domain.Entities;
using Sathus.Identity.Infrastructure.Persistence;

public class RoleRepository(IdentityDbContext dbContext) : IRoleRepository
{
    private readonly DbSet<Role> _dbSet = dbContext.Set<Role>();

    public async Task<Role?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(r => r.RolePermissions)
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);
    }

    public async Task<Role?> GetByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        return await _dbSet.FirstOrDefaultAsync(r => r.Name == name, cancellationToken);
    }

    public async Task<bool> ExistsByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        return await _dbSet.AnyAsync(r => r.Name == name, cancellationToken);
    }

    public async Task<IReadOnlyList<Role>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet.AsNoTracking().OrderBy(r => r.Name).ToListAsync(cancellationToken);
    }

    public async Task AddAsync(Role role, CancellationToken cancellationToken = default)
    {
        await _dbSet.AddAsync(role, cancellationToken);
    }

    public async Task UpdateAsync(Role role, CancellationToken cancellationToken = default)
    {
        _dbSet.Update(role);
        await Task.CompletedTask;
    }

    public async Task DeleteAsync(Role role, CancellationToken cancellationToken = default)
    {
        _dbSet.Remove(role);
        await Task.CompletedTask;
    }

    public async Task<IReadOnlyList<string>> GetPermissionNamesAsync(Guid roleId, CancellationToken cancellationToken = default)
    {
        return await dbContext.RolePermissions
            .Where(rp => rp.RoleId == roleId)
            .Select(rp => rp.Permission.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task SetPermissionsAsync(Guid roleId, IReadOnlyList<Guid> permissionIds, CancellationToken cancellationToken = default)
    {
        var existing = await dbContext.RolePermissions
            .Where(rp => rp.RoleId == roleId)
            .ToListAsync(cancellationToken);

        var incoming = permissionIds
            .Where(id => id != Guid.Empty)
            .Distinct()
            .ToList();

        foreach (var link in existing.Where(link => !incoming.Contains(link.PermissionId)).ToList())
        {
            dbContext.RolePermissions.Remove(link);
        }

        var existingIds = new HashSet<Guid>(existing.Select(link => link.PermissionId));
        foreach (var permissionId in incoming.Where(id => !existingIds.Contains(id)))
        {
            await dbContext.RolePermissions.AddAsync(new RolePermission(roleId, permissionId), cancellationToken);
        }
    }

    public async Task<bool> HasUsersAsync(Guid roleId, CancellationToken cancellationToken = default)
    {
        return await dbContext.UserRoles.AnyAsync(ur => ur.RoleId == roleId, cancellationToken);
    }
}

namespace Sathus.Identity.Infrastructure.Services;

using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using BCrypt.Net;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Domain.Entities;
using Sathus.Identity.Infrastructure.Persistence;

public class PasswordService(IdentityDbContext dbContext) : IPasswordService
{
    public string HashPassword(string password)
    {
        return BCrypt.HashPassword(password, 12);
    }

    public bool VerifyPassword(string password, string hashedPassword)
    {
        return BCrypt.Verify(password, hashedPassword);
    }

    public async Task<bool> CheckPasswordHistoryAsync(Guid userId, string passwordHash, int count, CancellationToken cancellationToken = default)
    {
        var recentHashes = await dbContext.PasswordHistory
            .AsNoTracking()
            .Where(ph => ph.UserId == userId)
            .OrderByDescending(ph => ph.CreatedAt)
            .Take(count)
            .Select(ph => ph.PasswordHash)
            .ToListAsync(cancellationToken);

        return recentHashes.Any(hash => BCrypt.Verify(passwordHash, hash));
    }
}

namespace Sathus.Identity.Infrastructure.Repositories;

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Domain.Entities;
using Sathus.Identity.Infrastructure.Persistence;

public interface IPasswordHistoryRepository
{
    Task AddAsync(PasswordHistory entry, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<PasswordHistory>> GetByUserAsync(
        Guid userId,
        int? limit = null,
        CancellationToken cancellationToken = default);
}

namespace Sathus.Identity.Infrastructure.Repositories;

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Sathus.Identity.Application.DTOs;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Domain.Entities;
using Sathus.Identity.Infrastructure.Persistence;

public interface ILoginHistoryRepository
{
    Task AddAsync(LoginHistory entry, CancellationToken cancellationToken = default);

    Task<PagedResult<LoginHistory>> GetByUserPagedAsync(
        Guid userId,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default);

    Task<int> CountRecentFailuresAsync(
        Guid userId,
        DateTime since,
        CancellationToken cancellationToken = default);
}

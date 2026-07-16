using MediatR;
using Sathus.Media.Application.Interfaces;
using Sathus.Media.Domain.Entities;
using Sathus.Media.Infrastructure.Persistence;

namespace Sathus.Media.Infrastructure.Repositories;

public sealed class EfMediaCollectionRepository : EfRepository<MediaCollection>, IMediaCollectionRepository
{
    public EfMediaCollectionRepository(MediaDbContext dbContext, IMediator mediator) : base(dbContext, mediator)
    {
    }
}

using Sathus.MediaRelations.Application.Interfaces;

namespace Sathus.MediaRelations.Infrastructure.Services;

public sealed class SystemClock : IClock
{
    public DateTime UtcNow => DateTime.UtcNow;
}

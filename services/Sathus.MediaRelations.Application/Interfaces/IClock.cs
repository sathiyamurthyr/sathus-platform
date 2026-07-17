namespace Sathus.MediaRelations.Application.Interfaces;

/// <summary>Provides the current UTC time; abstracted for deterministic testing.</summary>
public interface IClock
{
    DateTime UtcNow { get; }
}

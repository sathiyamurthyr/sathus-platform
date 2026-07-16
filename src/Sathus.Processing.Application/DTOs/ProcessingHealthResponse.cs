namespace Sathus.Processing.Application.DTOs;

public sealed record ProcessingHealthResponse(
    int Queued,
    int Running,
    int Succeeded,
    int Failed,
    int DeadLettered,
    int Total,
    bool QueueHealthy);

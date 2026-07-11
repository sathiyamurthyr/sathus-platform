using Sathus.Identity.Domain.Enums;

namespace Sathus.Identity.Application.DTOs;

public sealed record LoginHistoryResponse(
    Guid Id,
    LoginStatus Status,
    DateTime LoginAt,
    string? IpAddress,
    string? UserAgent,
    string? FailureReason);

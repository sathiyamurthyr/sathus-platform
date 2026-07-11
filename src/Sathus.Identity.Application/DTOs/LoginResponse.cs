namespace Sathus.Identity.Application.DTOs;

public sealed record LoginResponse(
    string AccessToken,
    string RefreshToken,
    int ExpiresIn,
    UserSummary User);

namespace Sathus.Identity.Application.DTOs;

public sealed record TokenResponse(string AccessToken, string RefreshToken);

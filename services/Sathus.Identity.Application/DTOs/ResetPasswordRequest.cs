namespace Sathus.Identity.Application.DTOs;

public sealed record ResetPasswordRequest(string Token, string NewPassword);

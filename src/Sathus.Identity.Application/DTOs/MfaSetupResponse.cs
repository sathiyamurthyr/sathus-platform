namespace Sathus.Identity.Application.DTOs;

public sealed record MfaSetupResponse(string Secret, string QrCodeUri);

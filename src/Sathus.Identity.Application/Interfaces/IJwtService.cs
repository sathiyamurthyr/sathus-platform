namespace Sathus.Identity.Application.Interfaces;

public interface IJwtService
{
    string GenerateAccessToken(
        Guid userId,
        string email,
        IReadOnlyList<string> roles,
        IReadOnlyList<string> permissions);

    string GenerateRefreshToken();

    bool ValidateToken(string token);

    Guid GetUserIdFromToken(string token);

    string GenerateEmailVerificationToken(Guid userId, string email);

    string GeneratePasswordResetToken(Guid userId, string email);

    bool TryValidateEmailVerificationToken(string token, out Guid userId);

    bool TryValidatePasswordResetToken(string token, out Guid userId);
}

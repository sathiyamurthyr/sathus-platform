namespace Sathus.Identity.Application.Interfaces;

public interface ITotpService
{
    string GenerateSecret();

    string GetQrCodeUri(string secret, string account, string issuer);
}

namespace Sathus.Identity.Application.Interfaces;

public interface IEmailService
{
    Task SendVerificationEmailAsync(string email, string token, CancellationToken cancellationToken = default);

    Task SendPasswordResetEmailAsync(string email, string token, CancellationToken cancellationToken = default);

    Task SendSecurityAlertEmailAsync(string email, string message, CancellationToken cancellationToken = default);
}

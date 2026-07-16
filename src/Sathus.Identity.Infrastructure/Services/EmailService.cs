namespace Sathus.Identity.Infrastructure.Services;

using System.Net;
using System.Net.Mail;
using System.Text;
using Microsoft.Extensions.Options;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Infrastructure.Security;

public class EmailService(IOptions<EmailOptions> options) : IEmailService
{
    private readonly EmailOptions _options = options.Value;

    public async Task SendVerificationEmailAsync(string email, string token, CancellationToken cancellationToken = default)
    {
        var verificationLink = $"https://localhost/verify-email?token={Uri.EscapeDataString(token)}";
        var body = new StringBuilder()
            .AppendLine("<h1>Verify Your Email</h1>")
            .AppendLine("<p>Click the link below to verify your email address:</p>")
            .AppendLine($"<a href=\"{verificationLink}\">Verify Email</a>")
            .ToString();

        await SendEmailAsync(_options.FromEmail, email, "Verify Your Email", body, cancellationToken);
    }

    public async Task SendPasswordResetEmailAsync(string email, string token, CancellationToken cancellationToken = default)
    {
        var resetLink = $"https://localhost/reset-password?token={Uri.EscapeDataString(token)}";
        var body = new StringBuilder()
            .AppendLine("<h1>Reset Your Password</h1>")
            .AppendLine("<p>Click the link below to reset your password:</p>")
            .AppendLine($"<a href=\"{resetLink}\">Reset Password</a>")
            .ToString();

        await SendEmailAsync(_options.FromEmail, email, "Reset Your Password", body, cancellationToken);
    }

    public async Task SendSecurityAlertEmailAsync(string email, string message, CancellationToken cancellationToken = default)
    {
        var body = new StringBuilder()
            .AppendLine("<h1>Security Alert</h1>")
            .AppendLine($"<p>{message}</p>")
            .ToString();

        await SendEmailAsync(_options.FromEmail, email, "Security Alert", body, cancellationToken);
    }

    private async Task SendEmailAsync(string from, string to, string subject, string htmlBody, CancellationToken cancellationToken)
    {
        using var message = new MailMessage
        {
            From = new MailAddress(from, _options.FromName),
            Subject = subject,
            Body = htmlBody,
            IsBodyHtml = true
        };
        message.To.Add(to);

        using var client = new SmtpClient(_options.SmtpHost, _options.SmtpPort)
        {
            EnableSsl = true,
            Credentials = _options.SmtpUser is null
                ? CredentialCache.DefaultNetworkCredentials
                : new NetworkCredential(_options.SmtpUser, _options.SmtpPass)
        };

        await client.SendMailAsync(message, cancellationToken);
    }
}

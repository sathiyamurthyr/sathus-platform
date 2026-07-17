using MediatR;

namespace Sathus.Identity.Application.Commands.ForgotPassword;

public sealed record ForgotPasswordCommand(string Email) : IRequest<bool>;

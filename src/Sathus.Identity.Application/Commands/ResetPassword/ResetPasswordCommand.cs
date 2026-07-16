using MediatR;

namespace Sathus.Identity.Application.Commands.ResetPassword;

public sealed record ResetPasswordCommand(string Token, string NewPassword) : IRequest<bool>;

using MediatR;

namespace Sathus.Identity.Application.Commands.ResetUserPassword;

public sealed record ResetUserPasswordCommand(Guid UserId, string NewPassword) : IRequest<Unit>;

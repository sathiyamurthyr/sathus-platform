using MediatR;

namespace Sathus.Identity.Application.Commands.DisableMfa;

public sealed record DisableMfaCommand(Guid UserId) : IRequest<bool>;

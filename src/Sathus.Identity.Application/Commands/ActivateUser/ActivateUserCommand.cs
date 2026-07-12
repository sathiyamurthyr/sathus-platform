using MediatR;

namespace Sathus.Identity.Application.Commands.ActivateUser;

public sealed record ActivateUserCommand(Guid UserId) : IRequest<Unit>;

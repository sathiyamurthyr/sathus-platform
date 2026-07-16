using MediatR;

namespace Sathus.Identity.Application.Commands.DeactivateUser;

public sealed record DeactivateUserCommand(Guid UserId) : IRequest<Unit>;

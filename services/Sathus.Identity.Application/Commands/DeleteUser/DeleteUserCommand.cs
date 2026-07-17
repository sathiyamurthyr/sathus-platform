using MediatR;

namespace Sathus.Identity.Application.Commands.DeleteUser;

public sealed record DeleteUserCommand(Guid UserId) : IRequest<Unit>;

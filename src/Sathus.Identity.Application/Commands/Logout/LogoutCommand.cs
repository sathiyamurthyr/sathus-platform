using MediatR;

namespace Sathus.Identity.Application.Commands.Logout;

public sealed record LogoutCommand(string RefreshToken) : IRequest<bool>;

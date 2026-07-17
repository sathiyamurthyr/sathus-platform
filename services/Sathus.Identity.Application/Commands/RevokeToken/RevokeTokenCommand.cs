using MediatR;

namespace Sathus.Identity.Application.Commands.RevokeToken;

public sealed record RevokeTokenCommand(string Token) : IRequest<bool>;

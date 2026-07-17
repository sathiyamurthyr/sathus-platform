using MediatR;

namespace Sathus.Identity.Application.Commands.VerifyEmail;

public sealed record VerifyEmailCommand(string Token) : IRequest<bool>;

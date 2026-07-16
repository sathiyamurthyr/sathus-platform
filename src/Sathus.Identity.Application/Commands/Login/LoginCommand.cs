using MediatR;
using Sathus.Identity.Application.DTOs;

namespace Sathus.Identity.Application.Commands.Login;

public sealed record LoginCommand(string Email, string Password, bool RememberMe) : IRequest<LoginResponse>;

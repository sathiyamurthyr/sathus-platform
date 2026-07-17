using MediatR;
using Sathus.Identity.Application.DTOs;

namespace Sathus.Identity.Application.Commands.RegisterUser;

public sealed record RegisterUserCommand(string Email, string Password, string FirstName, string LastName)
    : IRequest<UserResponse>;

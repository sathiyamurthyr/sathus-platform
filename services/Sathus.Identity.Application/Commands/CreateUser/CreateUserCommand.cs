using System.Collections.Generic;
using MediatR;
using Sathus.Identity.Application.DTOs;

namespace Sathus.Identity.Application.Commands.CreateUser;

public sealed record CreateUserCommand(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    IReadOnlyList<Guid> RoleIds)
    : IRequest<UserResponse>;

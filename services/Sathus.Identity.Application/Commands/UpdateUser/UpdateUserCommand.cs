using System.Collections.Generic;
using MediatR;
using Sathus.Identity.Application.DTOs;
using Sathus.Identity.Domain.Enums;

namespace Sathus.Identity.Application.Commands.UpdateUser;

public sealed record UpdateUserCommand(
    Guid UserId,
    string FirstName,
    string LastName,
    UserStatus? Status = null,
    IReadOnlyList<Guid>? RoleIds = null)
    : IRequest<UserResponse>;

using MediatR;
using Sathus.Identity.Application.DTOs;

namespace Sathus.Identity.Application.Queries.CurrentUser;

public sealed record CurrentUserQuery(Guid UserId) : IRequest<CurrentUserResponse>;

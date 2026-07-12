using MediatR;
using Sathus.Identity.Application.DTOs;

namespace Sathus.Identity.Application.Queries.GetUser;

public sealed record GetUserQuery(Guid UserId) : IRequest<UserDetailResponse>;

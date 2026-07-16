using MediatR;
using Sathus.Identity.Application.DTOs;

namespace Sathus.Identity.Application.Commands.EnableMfa;

public sealed record EnableMfaCommand(Guid UserId) : IRequest<MfaSetupResponse>;

using MediatR;
using Sathus.Storage.Application.DTOs;

namespace Sathus.Storage.Application.Queries.GetConfig;

public sealed record GetConfigQuery() : IRequest<ConfigResponse>;

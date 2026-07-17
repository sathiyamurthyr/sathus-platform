using MediatR;
using Sathus.Storage.Application.DTOs;

namespace Sathus.Storage.Application.Queries.GetProviders;

public sealed record GetProvidersQuery() : IRequest<IReadOnlyList<ProviderResponse>>;

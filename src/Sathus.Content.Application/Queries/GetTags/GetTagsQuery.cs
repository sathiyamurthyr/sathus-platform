using MediatR;
using Sathus.Content.Application.DTOs;

namespace Sathus.Content.Application.Queries.GetTags;

public sealed record GetTagsQuery : IRequest<IReadOnlyList<TagResponse>>;

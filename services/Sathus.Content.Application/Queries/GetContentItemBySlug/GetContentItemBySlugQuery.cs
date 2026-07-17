using MediatR;
using Sathus.Content.Application.DTOs;

namespace Sathus.Content.Application.Queries.GetContentItemBySlug;

public sealed record GetContentItemBySlugQuery(string Slug) : IRequest<ContentItemDetailResponse>;

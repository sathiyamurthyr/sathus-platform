using MediatR;
using Sathus.Content.Application.DTOs;

namespace Sathus.Content.Application.Queries.GetContentItem;

public sealed record GetContentItemQuery(Guid ContentItemId) : IRequest<ContentItemDetailResponse>;

using MediatR;
using Sathus.Content.Application.DTOs;

namespace Sathus.Content.Application.Commands.CreateTag;

public sealed record CreateTagCommand(string Name, string Slug) : IRequest<TagResponse>;

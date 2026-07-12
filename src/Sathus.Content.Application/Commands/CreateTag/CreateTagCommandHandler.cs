using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Sathus.Content.Application.DTOs;
using Sathus.Content.Application.Interfaces;
using Sathus.Content.Domain.Entities;
using Sathus.Content.Domain.ValueObjects;
using Sathus.Content.Application.Commands.CreateTag;

namespace Sathus.Content.Application.Commands.CreateTag;

public sealed class CreateTagCommandHandler : IRequestHandler<CreateTagCommand, TagResponse>
{
    private readonly ITagRepository _tags;
    private readonly IAuditService _audit;

    public CreateTagCommandHandler(ITagRepository tags, IAuditService audit)
    {
        _tags = tags;
        _audit = audit;
    }

    public async Task<TagResponse> Handle(CreateTagCommand request, CancellationToken cancellationToken)
    {
        var slug = Slug.Create(request.Slug);

        var tag = new Tag(request.Name, slug.Value);
        await _tags.AddAsync(tag, cancellationToken);

        await _audit.LogAsync(
            new AuditEntry("CreateTag", nameof(Tag), tag.Id, EntityId: tag.Id.ToString()),
            cancellationToken);

        return new TagResponse(tag.Id, tag.Name, tag.Slug);
    }
}

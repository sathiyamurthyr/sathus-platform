using MediatR;
using Sathus.Forms.Application.DTOs;
using Sathus.Forms.Application.Interfaces;
using Sathus.Forms.Domain.Entities;
using Sathus.Forms.Domain.Exceptions;

namespace Sathus.Forms.Application.Commands.Forms;

public sealed record CreateFormCommand(string Key, string Title, string? Description = null, string? Category = null, Guid? ActorId = null)
    : IRequest<FormSummaryDto>;

public sealed class CreateFormCommandHandler : IRequestHandler<CreateFormCommand, FormSummaryDto>
{
    private readonly IFormRepository _repository;

    public CreateFormCommandHandler(IFormRepository repository) => _repository = repository;

    public async Task<FormSummaryDto> Handle(CreateFormCommand request, CancellationToken cancellationToken)
    {
        var existing = await _repository.GetByKeyAsync(request.Key, cancellationToken);
        if (existing is not null)
        {
            throw new FormInvalidOperationException($"A form with key '{request.Key}' already exists.");
        }

        var form = Form.Create(request.Key, request.Title, request.Description, request.Category, request.ActorId);
        await _repository.AddAsync(form, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);

        return new FormSummaryDto(form.Id, form.Key, form.Title, form.Category, form.Status.ToString(),
            null, null, 0, 0, 0, form.UpdatedAt);
    }
}

public sealed record UpdateFormCommand(Guid Id, string Title, string? Description, string? Category, Guid? ActorId = null)
    : IRequest<FormSummaryDto>;

public sealed class UpdateFormCommandHandler : IRequestHandler<UpdateFormCommand, FormSummaryDto>
{
    private readonly IFormRepository _repository;

    public UpdateFormCommandHandler(IFormRepository repository) => _repository = repository;

    public async Task<FormSummaryDto> Handle(UpdateFormCommand request, CancellationToken cancellationToken)
    {
        var form = await _repository.GetWithStructureAsync(request.Id, cancellationToken)
            ?? throw new FormNotFoundException(request.Id);

        form.Rename(request.Title, request.ActorId);
        form.SetDescription(request.Description, request.ActorId);
        form.SetCategory(request.Category ?? form.Category, request.ActorId);

        await _repository.SaveChangesAsync(cancellationToken);

        return new FormSummaryDto(form.Id, form.Key, form.Title, form.Category, form.Status.ToString(),
            form.Versions.FirstOrDefault(v => v.Id == form.CurrentVersionId)?.VersionNumber,
            form.PublishedVersionId, form.Sections.Count, form.Sections.Sum(s => s.Fields.Count),
            await _repository.CountSubmissionsAsync(form.Id, cancellationToken), form.UpdatedAt);
    }
}

public sealed record DeleteFormCommand(Guid Id, Guid? ActorId = null) : IRequest<Unit>;

public sealed class DeleteFormCommandHandler : IRequestHandler<DeleteFormCommand, Unit>
{
    private readonly IFormRepository _repository;

    public DeleteFormCommandHandler(IFormRepository repository) => _repository = repository;

    public async Task<Unit> Handle(DeleteFormCommand request, CancellationToken cancellationToken)
    {
        var form = await _repository.GetWithStructureAsync(request.Id, cancellationToken)
            ?? throw new FormNotFoundException(request.Id);

        await _repository.DeleteAsync(form, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

public sealed record PublishFormCommand(Guid Id, Guid VersionId, Guid? ActorId = null)
    : IRequest<PublishResultDto>;

public sealed class PublishFormCommandHandler : IRequestHandler<PublishFormCommand, PublishResultDto>
{
    private readonly IFormRepository _repository;

    public PublishFormCommandHandler(IFormRepository repository) => _repository = repository;

    public async Task<PublishResultDto> Handle(PublishFormCommand request, CancellationToken cancellationToken)
    {
        var form = await _repository.GetWithStructureAsync(request.Id, cancellationToken)
            ?? throw new FormNotFoundException(request.Id);

        form.Publish(request.VersionId, request.ActorId);
        await _repository.SaveChangesAsync(cancellationToken);
        return new PublishResultDto(form.Id, request.VersionId, DateTime.UtcNow);
    }
}

public sealed record CreateFormVersionCommand(Guid Id, string? Label, Guid? ActorId = null)
    : IRequest<FormVersionDto>;

public sealed class CreateFormVersionCommandHandler : IRequestHandler<CreateFormVersionCommand, FormVersionDto>
{
    private readonly IFormRepository _repository;

    public CreateFormVersionCommandHandler(IFormRepository repository) => _repository = repository;

    public async Task<FormVersionDto> Handle(CreateFormVersionCommand request, CancellationToken cancellationToken)
    {
        var form = await _repository.GetWithStructureAsync(request.Id, cancellationToken)
            ?? throw new FormNotFoundException(request.Id);

        var version = form.CreateVersion(request.Label, request.ActorId);
        await _repository.SaveChangesAsync(cancellationToken);

        return new FormVersionDto(version.Id, version.VersionNumber, version.Label, version.Status.ToString(),
            version.IsCurrent, version.PublishedAt, version.CreatedAt);
    }
}

public sealed record RollbackFormCommand(Guid Id, Guid VersionId, Guid? ActorId = null) : IRequest<FormVersionDto>;

public sealed class RollbackFormCommandHandler : IRequestHandler<RollbackFormCommand, FormVersionDto>
{
    private readonly IFormRepository _repository;

    public RollbackFormCommandHandler(IFormRepository repository) => _repository = repository;

    public async Task<FormVersionDto> Handle(RollbackFormCommand request, CancellationToken cancellationToken)
    {
        var form = await _repository.GetWithStructureAsync(request.Id, cancellationToken)
            ?? throw new FormNotFoundException(request.Id);

        var version = form.Rollback(request.VersionId, request.ActorId);
        await _repository.SaveChangesAsync(cancellationToken);

        return new FormVersionDto(version.Id, version.VersionNumber, version.Label, version.Status.ToString(),
            version.IsCurrent, version.PublishedAt, version.CreatedAt);
    }
}

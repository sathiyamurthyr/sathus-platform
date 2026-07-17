using MediatR;
using Sathus.Forms.Application.DTOs;
using Sathus.Forms.Application.Interfaces;
using Sathus.Forms.Domain.Exceptions;

namespace Sathus.Forms.Application.Commands.Sections;

public sealed record AddSectionCommand(Guid FormId, string Key, string Title, string? Description = null, bool Collapsible = false, Guid? ActorId = null)
    : IRequest<FormSectionDto>;

public sealed class AddSectionCommandHandler : IRequestHandler<AddSectionCommand, FormSectionDto>
{
    private readonly IFormRepository _repository;

    public AddSectionCommandHandler(IFormRepository repository) => _repository = repository;

    public async Task<FormSectionDto> Handle(AddSectionCommand request, CancellationToken cancellationToken)
    {
        var form = await _repository.GetWithStructureAsync(request.FormId, cancellationToken)
            ?? throw new FormNotFoundException(request.FormId);

        var section = form.AddSection(request.Key, request.Title, request.Description, request.Collapsible, request.ActorId);
        await _repository.SaveChangesAsync(cancellationToken);
        return FormSectionDto.From(section);
    }
}

public sealed record UpdateSectionCommand(Guid FormId, Guid SectionId, string Title, string? Description, bool Collapsible, Guid? ActorId = null)
    : IRequest<FormSectionDto>;

public sealed class UpdateSectionCommandHandler : IRequestHandler<UpdateSectionCommand, FormSectionDto>
{
    private readonly IFormRepository _repository;

    public UpdateSectionCommandHandler(IFormRepository repository) => _repository = repository;

    public async Task<FormSectionDto> Handle(UpdateSectionCommand request, CancellationToken cancellationToken)
    {
        var form = await _repository.GetWithStructureAsync(request.FormId, cancellationToken)
            ?? throw new FormNotFoundException(request.FormId);

        form.UpdateSection(request.SectionId, request.Title, request.Description, request.Collapsible, request.ActorId);
        await _repository.SaveChangesAsync(cancellationToken);
        return FormSectionDto.From(form.GetSection(request.SectionId)!);
    }
}

public sealed record RemoveSectionCommand(Guid FormId, Guid SectionId, Guid? ActorId = null) : IRequest<Unit>;

public sealed class RemoveSectionCommandHandler : IRequestHandler<RemoveSectionCommand, Unit>
{
    private readonly IFormRepository _repository;

    public RemoveSectionCommandHandler(IFormRepository repository) => _repository = repository;

    public async Task<Unit> Handle(RemoveSectionCommand request, CancellationToken cancellationToken)
    {
        var form = await _repository.GetWithStructureAsync(request.FormId, cancellationToken)
            ?? throw new FormNotFoundException(request.FormId);

        form.RemoveSection(request.SectionId, request.ActorId);
        await _repository.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

public sealed record ReorderSectionCommand(Guid FormId, Guid SectionId, int NewOrder, Guid? ActorId = null) : IRequest<Unit>;

public sealed class ReorderSectionCommandHandler : IRequestHandler<ReorderSectionCommand, Unit>
{
    private readonly IFormRepository _repository;

    public ReorderSectionCommandHandler(IFormRepository repository) => _repository = repository;

    public async Task<Unit> Handle(ReorderSectionCommand request, CancellationToken cancellationToken)
    {
        var form = await _repository.GetWithStructureAsync(request.FormId, cancellationToken)
            ?? throw new FormNotFoundException(request.FormId);

        form.ReorderSection(request.SectionId, request.NewOrder, request.ActorId);
        await _repository.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

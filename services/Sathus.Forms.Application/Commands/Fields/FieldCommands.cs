using MediatR;
using Sathus.Forms.Application.Common;
using Sathus.Forms.Application.DTOs;
using Sathus.Forms.Application.Interfaces;
using Sathus.Forms.Domain.Entities;
using Sathus.Forms.Domain.Enums;
using Sathus.Forms.Domain.Exceptions;
using Sathus.Forms.Domain.ValueObjects;

namespace Sathus.Forms.Application.Commands.Fields;

public sealed record AddFieldCommand(
    Guid FormId, Guid SectionId, string Key, string Label, string Type,
    string? Placeholder = null, string? HelpText = null, string? DefaultValue = null,
    bool IsRequired = false, int Width = 12, string ReferenceKind = "None", Guid? ReferenceId = null, Guid? ActorId = null)
    : IRequest<FormFieldDto>;

public sealed class AddFieldCommandHandler : IRequestHandler<AddFieldCommand, FormFieldDto>
{
    private readonly IFormRepository _repository;

    public AddFieldCommandHandler(IFormRepository repository) => _repository = repository;

    public async Task<FormFieldDto> Handle(AddFieldCommand request, CancellationToken cancellationToken)
    {
        var form = await _repository.GetWithStructureAsync(request.FormId, cancellationToken)
            ?? throw new FormNotFoundException(request.FormId);

        var field = form.AddField(request.SectionId, request.Key, request.Label, Parsers.ParseFieldType(request.Type),
            request.Placeholder, request.HelpText, request.DefaultValue, request.IsRequired, request.Width,
            Parsers.ParseEnum<ReferenceKind>(request.ReferenceKind, ReferenceKind.None), request.ReferenceId, request.ActorId);

        await _repository.SaveChangesAsync(cancellationToken);
        return FormFieldDto.From(field);
    }
}

public sealed record UpdateFieldCommand(
    Guid FormId, Guid FieldId, string Label, string Type,
    string? Placeholder, string? HelpText, string? DefaultValue, bool IsRequired, int Width,
    string ReferenceKind, Guid? ReferenceId, Guid? ActorId = null)
    : IRequest<FormFieldDto>;

public sealed class UpdateFieldCommandHandler : IRequestHandler<UpdateFieldCommand, FormFieldDto>
{
    private readonly IFormRepository _repository;

    public UpdateFieldCommandHandler(IFormRepository repository) => _repository = repository;

    public async Task<FormFieldDto> Handle(UpdateFieldCommand request, CancellationToken cancellationToken)
    {
        var form = await _repository.GetWithStructureAsync(request.FormId, cancellationToken)
            ?? throw new FormNotFoundException(request.FormId);

        form.UpdateField(request.FieldId, request.Label, Parsers.ParseFieldType(request.Type), request.Placeholder,
            request.HelpText, request.DefaultValue, request.IsRequired, request.Width,
            Parsers.ParseEnum<ReferenceKind>(request.ReferenceKind, ReferenceKind.None), request.ReferenceId, request.ActorId);

        await _repository.SaveChangesAsync(cancellationToken);
        return FormFieldDto.From(form.FindField(request.FieldId).Field);
    }
}

public sealed record RemoveFieldCommand(Guid FormId, Guid FieldId, Guid? ActorId = null) : IRequest<Unit>;

public sealed class RemoveFieldCommandHandler : IRequestHandler<RemoveFieldCommand, Unit>
{
    private readonly IFormRepository _repository;

    public RemoveFieldCommandHandler(IFormRepository repository) => _repository = repository;

    public async Task<Unit> Handle(RemoveFieldCommand request, CancellationToken cancellationToken)
    {
        var form = await _repository.GetWithStructureAsync(request.FormId, cancellationToken)
            ?? throw new FormNotFoundException(request.FormId);

        form.RemoveField(request.FieldId, request.ActorId);
        await _repository.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

public sealed record DuplicateFieldCommand(Guid FormId, Guid FieldId, Guid? ActorId = null) : IRequest<FormFieldDto>;

public sealed class DuplicateFieldCommandHandler : IRequestHandler<DuplicateFieldCommand, FormFieldDto>
{
    private readonly IFormRepository _repository;

    public DuplicateFieldCommandHandler(IFormRepository repository) => _repository = repository;

    public async Task<FormFieldDto> Handle(DuplicateFieldCommand request, CancellationToken cancellationToken)
    {
        var form = await _repository.GetWithStructureAsync(request.FormId, cancellationToken)
            ?? throw new FormNotFoundException(request.FormId);

        var copy = form.DuplicateField(request.FieldId, request.ActorId);
        await _repository.SaveChangesAsync(cancellationToken);
        return FormFieldDto.From(copy);
    }
}

public sealed record ReorderFieldCommand(Guid FormId, Guid FieldId, int NewOrder, Guid? ActorId = null) : IRequest<Unit>;

public sealed class ReorderFieldCommandHandler : IRequestHandler<ReorderFieldCommand, Unit>
{
    private readonly IFormRepository _repository;

    public ReorderFieldCommandHandler(IFormRepository repository) => _repository = repository;

    public async Task<Unit> Handle(ReorderFieldCommand request, CancellationToken cancellationToken)
    {
        var form = await _repository.GetWithStructureAsync(request.FormId, cancellationToken)
            ?? throw new FormNotFoundException(request.FormId);

        form.ReorderField(request.FieldId, request.NewOrder, request.ActorId);
        await _repository.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

public sealed record MoveFieldCommand(Guid FormId, Guid FieldId, Guid ToSectionId, int NewOrder, Guid? ActorId = null) : IRequest<Unit>;

public sealed class MoveFieldCommandHandler : IRequestHandler<MoveFieldCommand, Unit>
{
    private readonly IFormRepository _repository;

    public MoveFieldCommandHandler(IFormRepository repository) => _repository = repository;

    public async Task<Unit> Handle(MoveFieldCommand request, CancellationToken cancellationToken)
    {
        var form = await _repository.GetWithStructureAsync(request.FormId, cancellationToken)
            ?? throw new FormNotFoundException(request.FormId);

        form.MoveField(request.FieldId, request.ToSectionId, request.NewOrder, request.ActorId);
        await _repository.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

public sealed record SetFieldVisibilityCommand(Guid FormId, Guid FieldId, string? ConditionJson, Guid? ActorId = null) : IRequest<FormFieldDto>;

public sealed class SetFieldVisibilityCommandHandler : IRequestHandler<SetFieldVisibilityCommand, FormFieldDto>
{
    private readonly IFormRepository _repository;

    public SetFieldVisibilityCommandHandler(IFormRepository repository) => _repository = repository;

    public async Task<FormFieldDto> Handle(SetFieldVisibilityCommand request, CancellationToken cancellationToken)
    {
        var form = await _repository.GetWithStructureAsync(request.FormId, cancellationToken)
            ?? throw new FormNotFoundException(request.FormId);

        var (_, field) = form.FindField(request.FieldId);
        var condition = string.IsNullOrWhiteSpace(request.ConditionJson)
            ? null
            : System.Text.Json.JsonSerializer.Deserialize<VisibilityCondition>(request.ConditionJson);
        field.SetVisibilityCondition(condition, request.ActorId);

        await _repository.SaveChangesAsync(cancellationToken);
        return FormFieldDto.From(field);
    }
}

public sealed record AddFieldOptionCommand(Guid FormId, Guid FieldId, string Value, string Label, int Order, Guid? ActorId = null) : IRequest<FormFieldDto>;

public sealed class AddFieldOptionCommandHandler : IRequestHandler<AddFieldOptionCommand, FormFieldDto>
{
    private readonly IFormRepository _repository;

    public AddFieldOptionCommandHandler(IFormRepository repository) => _repository = repository;

    public async Task<FormFieldDto> Handle(AddFieldOptionCommand request, CancellationToken cancellationToken)
    {
        var form = await _repository.GetWithStructureAsync(request.FormId, cancellationToken)
            ?? throw new FormNotFoundException(request.FormId);

        var (_, field) = form.FindField(request.FieldId);
        field.AddOption(request.Value, request.Label, request.Order, request.ActorId);

        await _repository.SaveChangesAsync(cancellationToken);
        return FormFieldDto.From(field);
    }
}

public sealed record RemoveFieldOptionCommand(Guid FormId, Guid FieldId, Guid OptionId, Guid? ActorId = null) : IRequest<Unit>;

public sealed class RemoveFieldOptionCommandHandler : IRequestHandler<RemoveFieldOptionCommand, Unit>
{
    private readonly IFormRepository _repository;

    public RemoveFieldOptionCommandHandler(IFormRepository repository) => _repository = repository;

    public async Task<Unit> Handle(RemoveFieldOptionCommand request, CancellationToken cancellationToken)
    {
        var form = await _repository.GetWithStructureAsync(request.FormId, cancellationToken)
            ?? throw new FormNotFoundException(request.FormId);

        var (_, field) = form.FindField(request.FieldId);
        field.RemoveOption(request.OptionId);

        await _repository.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

public sealed record AddValidationRuleCommand(Guid FormId, Guid FieldId, string Type, string? Value, string? Message, Guid? ActorId = null) : IRequest<FormFieldDto>;

public sealed class AddValidationRuleCommandHandler : IRequestHandler<AddValidationRuleCommand, FormFieldDto>
{
    private readonly IFormRepository _repository;

    public AddValidationRuleCommandHandler(IFormRepository repository) => _repository = repository;

    public async Task<FormFieldDto> Handle(AddValidationRuleCommand request, CancellationToken cancellationToken)
    {
        var form = await _repository.GetWithStructureAsync(request.FormId, cancellationToken)
            ?? throw new FormNotFoundException(request.FormId);

        var (_, field) = form.FindField(request.FieldId);
        field.AddValidationRule(Parsers.ParseEnum<ValidationRuleType>(request.Type, ValidationRuleType.Required), request.Value, request.Message, request.ActorId);

        await _repository.SaveChangesAsync(cancellationToken);
        return FormFieldDto.From(field);
    }
}

public sealed record RemoveValidationRuleCommand(Guid FormId, Guid FieldId, Guid RuleId, Guid? ActorId = null) : IRequest<Unit>;

public sealed class RemoveValidationRuleCommandHandler : IRequestHandler<RemoveValidationRuleCommand, Unit>
{
    private readonly IFormRepository _repository;

    public RemoveValidationRuleCommandHandler(IFormRepository repository) => _repository = repository;

    public async Task<Unit> Handle(RemoveValidationRuleCommand request, CancellationToken cancellationToken)
    {
        var form = await _repository.GetWithStructureAsync(request.FormId, cancellationToken)
            ?? throw new FormNotFoundException(request.FormId);

        var (_, field) = form.FindField(request.FieldId);
        field.RemoveValidationRule(request.RuleId);

        await _repository.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

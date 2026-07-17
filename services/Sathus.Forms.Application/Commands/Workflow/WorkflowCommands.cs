using System.Collections.Generic;
using MediatR;
using Sathus.Forms.Application.DTOs;
using Sathus.Forms.Application.Interfaces;
using Sathus.Forms.Domain.Entities;
using Sathus.Forms.Domain.Enums;
using Sathus.Forms.Domain.Exceptions;

namespace Sathus.Forms.Application.Commands.Workflow;

public sealed record CreateWorkflowCommand(Guid FormId, string Name, bool TriggerOnSubmit = true, Guid? ActorId = null)
    : IRequest<WorkflowDto>;

public sealed class CreateWorkflowCommandHandler : IRequestHandler<CreateWorkflowCommand, WorkflowDto>
{
    private readonly IWorkflowRepository _repository;

    public CreateWorkflowCommandHandler(IWorkflowRepository repository) => _repository = repository;

    public async Task<WorkflowDto> Handle(CreateWorkflowCommand request, CancellationToken cancellationToken)
    {
        var existing = await _repository.GetByFormAsync(request.FormId, cancellationToken);
        if (existing is not null)
        {
            throw new FormInvalidOperationException($"A workflow already exists for form '{request.FormId}'.");
        }

        var workflow = Sathus.Forms.Domain.Entities.Workflow.Create(request.FormId, request.Name, request.TriggerOnSubmit, request.ActorId);
        await _repository.AddAsync(workflow, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);
        return WorkflowDto.From(workflow);
    }
}

public sealed record AddWorkflowStepCommand(Guid WorkflowId, string Name, string Type, int Order, IDictionary<string, object?>? Config = null, Guid? ActorId = null)
    : IRequest<WorkflowStepDto>;

public sealed class AddWorkflowStepCommandHandler : IRequestHandler<AddWorkflowStepCommand, WorkflowStepDto>
{
    private readonly IWorkflowRepository _repository;

    public AddWorkflowStepCommandHandler(IWorkflowRepository repository) => _repository = repository;

    public async Task<WorkflowStepDto> Handle(AddWorkflowStepCommand request, CancellationToken cancellationToken)
    {
        var workflow = await _repository.GetByIdAsync(request.WorkflowId, cancellationToken)
            ?? throw new WorkflowNotFoundException(request.WorkflowId);

        var step = workflow.AddStep(request.Name, Parsers.ParseEnum(request.Type, WorkflowStepType.Review), request.Order, request.Config, request.ActorId);
        await _repository.SaveChangesAsync(cancellationToken);
        return WorkflowStepDto.From(step);
    }
}

public sealed record RemoveWorkflowStepCommand(Guid WorkflowId, Guid StepId, Guid? ActorId = null) : IRequest<Unit>;

public sealed class RemoveWorkflowStepCommandHandler : IRequestHandler<RemoveWorkflowStepCommand, Unit>
{
    private readonly IWorkflowRepository _repository;

    public RemoveWorkflowStepCommandHandler(IWorkflowRepository repository) => _repository = repository;

    public async Task<Unit> Handle(RemoveWorkflowStepCommand request, CancellationToken cancellationToken)
    {
        var workflow = await _repository.GetByIdAsync(request.WorkflowId, cancellationToken)
            ?? throw new WorkflowNotFoundException(request.WorkflowId);

        workflow.RemoveStep(request.StepId, request.ActorId);
        await _repository.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

public sealed record AddWorkflowActionCommand(Guid WorkflowId, Guid StepId, string Type, IDictionary<string, object?>? Config = null, Guid? ActorId = null)
    : IRequest<WorkflowActionDto>;

public sealed class AddWorkflowActionCommandHandler : IRequestHandler<AddWorkflowActionCommand, WorkflowActionDto>
{
    private readonly IWorkflowRepository _repository;

    public AddWorkflowActionCommandHandler(IWorkflowRepository repository) => _repository = repository;

    public async Task<WorkflowActionDto> Handle(AddWorkflowActionCommand request, CancellationToken cancellationToken)
    {
        var workflow = await _repository.GetByIdAsync(request.WorkflowId, cancellationToken)
            ?? throw new WorkflowNotFoundException(request.WorkflowId);

        workflow.AddAction(request.StepId, Parsers.ParseEnum(request.Type, WorkflowActionType.CreateTask), request.Config, request.ActorId);
        await _repository.SaveChangesAsync(cancellationToken);

        var step = workflow.Steps.First(s => s.Id == request.StepId);
        var action = step.Actions.OrderByDescending(a => a.Order).First();
        return new WorkflowActionDto(action.Id, action.Type.ToString(), action.Order, (IReadOnlyDictionary<string, object?>?)action.GetConfig());
    }
}

public sealed record AddApprovalRuleCommand(Guid WorkflowId, Guid StepId, string Role, string? ConditionJson = null, int Order = 0, Guid? ActorId = null) : IRequest<ApprovalRuleDto>;

public sealed class AddApprovalRuleCommandHandler : IRequestHandler<AddApprovalRuleCommand, ApprovalRuleDto>
{
    private readonly IWorkflowRepository _repository;

    public AddApprovalRuleCommandHandler(IWorkflowRepository repository) => _repository = repository;

    public async Task<ApprovalRuleDto> Handle(AddApprovalRuleCommand request, CancellationToken cancellationToken)
    {
        var workflow = await _repository.GetByIdAsync(request.WorkflowId, cancellationToken)
            ?? throw new WorkflowNotFoundException(request.WorkflowId);

        workflow.AddApprovalRule(request.StepId, request.Role, request.ConditionJson, request.Order, request.ActorId);
        await _repository.SaveChangesAsync(cancellationToken);

        var step = workflow.Steps.First(s => s.Id == request.StepId);
        var rule = step.ApprovalRules.OrderByDescending(r => r.Order).First();
        return new ApprovalRuleDto(rule.Id, rule.Role, rule.Order, rule.ConditionJson);
    }
}

public sealed record AddNotificationRuleCommand(Guid WorkflowId, Guid StepId, string Channel, string Recipient, string? Template = null, string? ConditionJson = null, Guid? ActorId = null) : IRequest<NotificationRuleDto>;

public sealed class AddNotificationRuleCommandHandler : IRequestHandler<AddNotificationRuleCommand, NotificationRuleDto>
{
    private readonly IWorkflowRepository _repository;

    public AddNotificationRuleCommandHandler(IWorkflowRepository repository) => _repository = repository;

    public async Task<NotificationRuleDto> Handle(AddNotificationRuleCommand request, CancellationToken cancellationToken)
    {
        var workflow = await _repository.GetByIdAsync(request.WorkflowId, cancellationToken)
            ?? throw new WorkflowNotFoundException(request.WorkflowId);

        workflow.AddNotificationRule(request.StepId, Parsers.ParseEnum(request.Channel, NotificationChannel.Email), request.Recipient, request.Template, request.ConditionJson, request.ActorId);
        await _repository.SaveChangesAsync(cancellationToken);

        var step = workflow.Steps.First(s => s.Id == request.StepId);
        var rule = step.NotificationRules.OrderByDescending(r => r.Id).First();
        return new NotificationRuleDto(rule.Id, rule.Channel.ToString(), rule.Recipient, rule.Template, rule.ConditionJson);
    }
}

public sealed record SetWorkflowEnabledCommand(Guid WorkflowId, bool Enabled, Guid? ActorId = null) : IRequest<WorkflowDto>;

public sealed class SetWorkflowEnabledCommandHandler : IRequestHandler<SetWorkflowEnabledCommand, WorkflowDto>
{
    private readonly IWorkflowRepository _repository;

    public SetWorkflowEnabledCommandHandler(IWorkflowRepository repository) => _repository = repository;

    public async Task<WorkflowDto> Handle(SetWorkflowEnabledCommand request, CancellationToken cancellationToken)
    {
        var workflow = await _repository.GetByIdAsync(request.WorkflowId, cancellationToken)
            ?? throw new WorkflowNotFoundException(request.WorkflowId);

        if (request.Enabled)
        {
            workflow.Enable(request.ActorId);
        }
        else
        {
            workflow.Disable(request.ActorId);
        }

        await _repository.SaveChangesAsync(cancellationToken);
        return WorkflowDto.From(workflow);
    }
}

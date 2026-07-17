using FluentValidation;
using Sathus.Forms.Application.Commands.Forms;
using Sathus.Forms.Application.Commands.Fields;
using Sathus.Forms.Application.Commands.Sections;
using Sathus.Forms.Application.Commands.Submissions;
using Sathus.Forms.Application.Commands.Workflow;

namespace Sathus.Forms.Application.Validators;

public sealed class CreateFormCommandValidator : AbstractValidator<CreateFormCommand>
{
    public CreateFormCommandValidator()
    {
        RuleFor(x => x.Key).NotEmpty().MaximumLength(128).Matches("^[a-z0-9][a-z0-9_-]*$")
            .WithMessage("Key must be lower-case alphanumeric with hyphens/underscores.");
        RuleFor(x => x.Title).NotEmpty().MaximumLength(256);
        RuleFor(x => x.Category).MaximumLength(128);
    }
}

public sealed class UpdateFormCommandValidator : AbstractValidator<UpdateFormCommand>
{
    public UpdateFormCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Title).NotEmpty().MaximumLength(256);
    }
}

public sealed class PublishFormCommandValidator : AbstractValidator<PublishFormCommand>
{
    public PublishFormCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.VersionId).NotEmpty();
    }
}

public sealed class AddSectionCommandValidator : AbstractValidator<AddSectionCommand>
{
    public AddSectionCommandValidator()
    {
        RuleFor(x => x.FormId).NotEmpty();
        RuleFor(x => x.Key).NotEmpty().MaximumLength(128);
        RuleFor(x => x.Title).NotEmpty().MaximumLength(256);
    }
}

public sealed class AddFieldCommandValidator : AbstractValidator<AddFieldCommand>
{
    public AddFieldCommandValidator()
    {
        RuleFor(x => x.FormId).NotEmpty();
        RuleFor(x => x.SectionId).NotEmpty();
        RuleFor(x => x.Key).NotEmpty().MaximumLength(128);
        RuleFor(x => x.Label).NotEmpty().MaximumLength(256);
        RuleFor(x => x.Type).NotEmpty();
        RuleFor(x => x.Width).InclusiveBetween(1, 12);
    }
}

public sealed class UpdateFieldCommandValidator : AbstractValidator<UpdateFieldCommand>
{
    public UpdateFieldCommandValidator()
    {
        RuleFor(x => x.FormId).NotEmpty();
        RuleFor(x => x.FieldId).NotEmpty();
        RuleFor(x => x.Label).NotEmpty().MaximumLength(256);
        RuleFor(x => x.Width).InclusiveBetween(1, 12);
    }
}

public sealed class DuplicateFieldCommandValidator : AbstractValidator<DuplicateFieldCommand>
{
    public DuplicateFieldCommandValidator()
    {
        RuleFor(x => x.FormId).NotEmpty();
        RuleFor(x => x.FieldId).NotEmpty();
    }
}

public sealed class ReorderFieldCommandValidator : AbstractValidator<ReorderFieldCommand>
{
    public ReorderFieldCommandValidator()
    {
        RuleFor(x => x.FormId).NotEmpty();
        RuleFor(x => x.FieldId).NotEmpty();
        RuleFor(x => x.NewOrder).GreaterThanOrEqualTo(0);
    }
}

public sealed class MoveFieldCommandValidator : AbstractValidator<MoveFieldCommand>
{
    public MoveFieldCommandValidator()
    {
        RuleFor(x => x.FormId).NotEmpty();
        RuleFor(x => x.FieldId).NotEmpty();
        RuleFor(x => x.ToSectionId).NotEmpty();
        RuleFor(x => x.NewOrder).GreaterThanOrEqualTo(0);
    }
}

public sealed class CreateWorkflowCommandValidator : AbstractValidator<CreateWorkflowCommand>
{
    public CreateWorkflowCommandValidator()
    {
        RuleFor(x => x.FormId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(256);
    }
}

public sealed class AddWorkflowStepCommandValidator : AbstractValidator<AddWorkflowStepCommand>
{
    public AddWorkflowStepCommandValidator()
    {
        RuleFor(x => x.WorkflowId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(256);
        RuleFor(x => x.Type).NotEmpty();
        RuleFor(x => x.Order).GreaterThanOrEqualTo(0);
    }
}

public sealed class AddWorkflowActionCommandValidator : AbstractValidator<AddWorkflowActionCommand>
{
    public AddWorkflowActionCommandValidator()
    {
        RuleFor(x => x.WorkflowId).NotEmpty();
        RuleFor(x => x.StepId).NotEmpty();
        RuleFor(x => x.Type).NotEmpty();
    }
}

public sealed class AddApprovalRuleCommandValidator : AbstractValidator<AddApprovalRuleCommand>
{
    public AddApprovalRuleCommandValidator()
    {
        RuleFor(x => x.WorkflowId).NotEmpty();
        RuleFor(x => x.StepId).NotEmpty();
        RuleFor(x => x.Role).NotEmpty().MaximumLength(128);
    }
}

public sealed class AddNotificationRuleCommandValidator : AbstractValidator<AddNotificationRuleCommand>
{
    public AddNotificationRuleCommandValidator()
    {
        RuleFor(x => x.WorkflowId).NotEmpty();
        RuleFor(x => x.StepId).NotEmpty();
        RuleFor(x => x.Channel).NotEmpty();
        RuleFor(x => x.Recipient).NotEmpty().MaximumLength(512);
    }
}

public sealed class SubmitFormCommandValidator : AbstractValidator<SubmitFormCommand>
{
    public SubmitFormCommandValidator()
    {
        RuleFor(x => x.FormId).NotEmpty();
        RuleFor(x => x.Values).NotNull();
        RuleFor(x => x.SubmitterEmail).EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.SubmitterEmail))
            .WithMessage("Submitter email must be a valid address.");
    }
}

public sealed class ApproveSubmissionCommandValidator : AbstractValidator<ApproveSubmissionCommand>
{
    public ApproveSubmissionCommandValidator()
    {
        RuleFor(x => x.SubmissionId).NotEmpty();
    }
}

public sealed class RejectSubmissionCommandValidator : AbstractValidator<RejectSubmissionCommand>
{
    public RejectSubmissionCommandValidator()
    {
        RuleFor(x => x.SubmissionId).NotEmpty();
    }
}

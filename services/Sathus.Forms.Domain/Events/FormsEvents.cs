using Sathus.SharedKernel.Events;

namespace Sathus.Forms.Domain.Events;

public sealed class FormCreatedEvent : DomainEvent
{
    public Guid FormId { get; }
    public FormCreatedEvent(Guid formId) => FormId = formId;
}

public sealed class FormSectionCreatedEvent : DomainEvent
{
    public Guid FormId { get; }
    public Guid SectionId { get; }
    public FormSectionCreatedEvent(Guid formId, Guid sectionId)
    {
        FormId = formId;
        SectionId = sectionId;
    }
}

public sealed class FormFieldCreatedEvent : DomainEvent
{
    public Guid FormId { get; }
    public Guid SectionId { get; }
    public Guid FieldId { get; }
    public FormFieldCreatedEvent(Guid formId, Guid sectionId, Guid fieldId)
    {
        FormId = formId;
        SectionId = sectionId;
        FieldId = fieldId;
    }
}

public sealed class FormPublishedEvent : DomainEvent
{
    public Guid FormId { get; }
    public Guid VersionId { get; }
    public FormPublishedEvent(Guid formId, Guid versionId)
    {
        FormId = formId;
        VersionId = versionId;
    }
}

public sealed class FormRolledBackEvent : DomainEvent
{
    public Guid FormId { get; }
    public Guid VersionId { get; }
    public FormRolledBackEvent(Guid formId, Guid versionId)
    {
        FormId = formId;
        VersionId = versionId;
    }
}

public sealed class FormArchivedEvent : DomainEvent
{
    public Guid FormId { get; }
    public FormArchivedEvent(Guid formId) => FormId = formId;
}

public sealed class SubmissionReceivedEvent : DomainEvent
{
    public Guid SubmissionId { get; }
    public Guid FormId { get; }
    public bool IsSpam { get; }
    public SubmissionReceivedEvent(Guid submissionId, Guid formId, bool isSpam)
    {
        SubmissionId = submissionId;
        FormId = formId;
        IsSpam = isSpam;
    }
}

public sealed class SubmissionApprovedEvent : DomainEvent
{
    public Guid SubmissionId { get; }
    public Guid FormId { get; }
    public SubmissionApprovedEvent(Guid submissionId, Guid formId)
    {
        SubmissionId = submissionId;
        FormId = formId;
    }
}

public sealed class SubmissionRejectedEvent : DomainEvent
{
    public Guid SubmissionId { get; }
    public Guid FormId { get; }
    public SubmissionRejectedEvent(Guid submissionId, Guid formId)
    {
        SubmissionId = submissionId;
        FormId = formId;
    }
}

public sealed class WorkflowStepCreatedEvent : DomainEvent
{
    public Guid WorkflowId { get; }
    public Guid StepId { get; }
    public WorkflowStepCreatedEvent(Guid workflowId, Guid stepId)
    {
        WorkflowId = workflowId;
        StepId = stepId;
    }
}

public sealed class WorkflowDisabledEvent : DomainEvent
{
    public Guid WorkflowId { get; }
    public Guid FormId { get; }
    public WorkflowDisabledEvent(Guid workflowId, Guid formId)
    {
        WorkflowId = workflowId;
        FormId = formId;
    }
}

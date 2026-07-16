using Sathus.SharedKernel.Exceptions;

namespace Sathus.Forms.Domain.Exceptions;

public sealed class FormNotFoundException : AppException
{
    public FormNotFoundException(Guid formId) : base($"Form '{formId}' was not found.") => FormId = formId;
    public Guid FormId { get; }
}

public sealed class FormVersionNotFoundException : AppException
{
    public FormVersionNotFoundException(Guid versionId) : base($"Form version '{versionId}' was not found.") => VersionId = versionId;
    public Guid VersionId { get; }
}

public sealed class FormSectionNotFoundException : AppException
{
    public FormSectionNotFoundException(Guid sectionId) : base($"Form section '{sectionId}' was not found.") => SectionId = sectionId;
    public Guid SectionId { get; }
}

public sealed class FormFieldNotFoundException : AppException
{
    public FormFieldNotFoundException(Guid fieldId) : base($"Form field '{fieldId}' was not found.") => FieldId = fieldId;
    public Guid FieldId { get; }
}

public sealed class SubmissionNotFoundException : AppException
{
    public SubmissionNotFoundException(Guid submissionId) : base($"Submission '{submissionId}' was not found.") => SubmissionId = submissionId;
    public Guid SubmissionId { get; }
}

public sealed class WorkflowNotFoundException : AppException
{
    public WorkflowNotFoundException(Guid workflowId) : base($"Workflow '{workflowId}' was not found.") => WorkflowId = workflowId;
    public Guid WorkflowId { get; }
}

public sealed class WorkflowStepNotFoundException : AppException
{
    public WorkflowStepNotFoundException(Guid stepId) : base($"Workflow step '{stepId}' was not found.") => StepId = stepId;
    public Guid StepId { get; }
}

public sealed class FormInvalidOperationException : AppException
{
    public FormInvalidOperationException(string message) : base(message)
    {
    }
}

public sealed class SubmissionInvalidOperationException : AppException
{
    public SubmissionInvalidOperationException(string message) : base(message)
    {
    }
}

public sealed class FormValidationException : AppException
{
    public FormValidationException(string message) : base(message)
    {
    }
}

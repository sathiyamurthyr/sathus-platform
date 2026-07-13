using System.Collections.Generic;
using Sathus.Forms.Domain.Entities;
using Sathus.Forms.Domain.Enums;
using Sathus.Forms.Domain.ValueObjects;

namespace Sathus.Forms.Application.DTOs;

public sealed record FieldOptionDto(Guid Id, string Value, string Label, int Order);

public sealed record ValidationRuleDto(Guid Id, string Type, string? Value, string? Message);

public sealed record VisibilityConditionDto(
    string Field,
    string Operator,
    string? Value,
    string Combinator = "And",
    IReadOnlyList<VisibilityConditionDto>? Children = null);

public sealed record FormFieldDto(
    Guid Id,
    Guid SectionId,
    string Key,
    string Label,
    string Type,
    string? Placeholder,
    string? HelpText,
    string? DefaultValue,
    bool IsRequired,
    int Order,
    int Width,
    string ReferenceKind,
    Guid? ReferenceId,
    VisibilityConditionDto? VisibilityCondition,
    IReadOnlyList<FieldOptionDto> Options,
    IReadOnlyList<ValidationRuleDto> ValidationRules)
{
    public static FormFieldDto From(FormField field) => new(
        field.Id,
        field.SectionId,
        field.Key,
        field.Label,
        field.Type.ToString(),
        field.Placeholder,
        field.HelpText,
        field.DefaultValue,
        field.IsRequired,
        field.Order,
        field.Width,
        field.ReferenceKind.ToString(),
        field.ReferenceId,
        From(field.GetVisibilityCondition()),
        field.Options.OrderBy(o => o.Order).Select(o => new FieldOptionDto(o.Id, o.Value, o.Label, o.Order)).ToList(),
        field.ValidationRules.Select(r => new ValidationRuleDto(r.Id, r.Type.ToString(), r.Value, r.Message)).ToList());

    private static VisibilityConditionDto? From(VisibilityCondition? c) =>
        c is null ? null : new VisibilityConditionDto(c.Field, c.Operator.ToString(), c.Value, c.Combinator.ToString(),
            c.Children?.Select(From).ToList());
}

public sealed record FormSectionDto(
    Guid Id,
    string Key,
    string Title,
    string? Description,
    int Order,
    bool Collapsible,
    bool IsVisible,
    VisibilityConditionDto? VisibilityCondition,
    IReadOnlyList<FormFieldDto> Fields)
{
    public static FormSectionDto From(FormSection section) => new(
        section.Id,
        section.Key,
        section.Title,
        section.Description,
        section.Order,
        section.Collapsible,
        section.IsVisible,
        From(section.GetVisibilityCondition()),
        section.Fields.OrderBy(f => f.Order).Select(FormFieldDto.From).ToList());

    private static VisibilityConditionDto? From(VisibilityCondition? c) =>
        c is null ? null : new VisibilityConditionDto(c.Field, c.Operator.ToString(), c.Value, c.Combinator.ToString(),
            c.Children?.Select(From).ToList());
}

public sealed record FormVersionDto(
    Guid Id,
    int VersionNumber,
    string Label,
    string Status,
    bool IsCurrent,
    DateTime? PublishedAt,
    DateTime CreatedAt);

public sealed record FormSummaryDto(
    Guid Id,
    string Key,
    string Title,
    string Category,
    string Status,
    int? VersionNumber,
    Guid? PublishedVersionId,
    int SectionCount,
    int FieldCount,
    int SubmissionCount,
    DateTime UpdatedAt);

public sealed record FormDetailDto(
    Guid Id,
    string Key,
    string Title,
    string? Description,
    string Category,
    string Status,
    Guid? CurrentVersionId,
    Guid? PublishedVersionId,
    IReadOnlyList<FormSectionDto> Sections,
    IReadOnlyList<FormVersionDto> Versions,
    WorkflowDto? Workflow,
    int SubmissionCount,
    DateTime CreatedAt,
    DateTime UpdatedAt);

public sealed record SubmitResultDto(Guid SubmissionId, string Status, bool TriggeredWorkflow);

public sealed record PublishResultDto(Guid FormId, Guid VersionId, DateTime PublishedAt);

public sealed record WorkflowActionDto(Guid Id, string Type, int Order, IReadOnlyDictionary<string, object?>? Config);

public sealed record ApprovalRuleDto(Guid Id, string Role, int Order, string? ConditionJson);

public sealed record NotificationRuleDto(Guid Id, string Channel, string Recipient, string? Template, string? ConditionJson);

public sealed record WorkflowStepDto(
    Guid Id,
    string Name,
    string Type,
    int Order,
    IReadOnlyDictionary<string, object?>? Config,
    IReadOnlyList<WorkflowActionDto> Actions,
    IReadOnlyList<ApprovalRuleDto> ApprovalRules,
    IReadOnlyList<NotificationRuleDto> NotificationRules)
{
    public static WorkflowStepDto From(WorkflowStep step) => new(
        step.Id,
        step.Name,
        step.Type.ToString(),
        step.Order,
        (IReadOnlyDictionary<string, object?>?)step.GetConfig(),
        step.Actions.OrderBy(a => a.Order).Select(a => new WorkflowActionDto(a.Id, a.Type.ToString(), a.Order, (IReadOnlyDictionary<string, object?>?)a.GetConfig())).ToList(),
        step.ApprovalRules.OrderBy(r => r.Order).Select(r => new ApprovalRuleDto(r.Id, r.Role, r.Order, r.ConditionJson)).ToList(),
        step.NotificationRules.Select(r => new NotificationRuleDto(r.Id, r.Channel.ToString(), r.Recipient, r.Template, r.ConditionJson)).ToList());
}

public sealed record WorkflowDto(
    Guid Id,
    Guid FormId,
    string Name,
    bool IsEnabled,
    bool TriggerOnSubmit,
    IReadOnlyList<WorkflowStepDto> Steps)
{
    public static WorkflowDto From(Sathus.Forms.Domain.Entities.Workflow workflow) => new(
        workflow.Id,
        workflow.FormId,
        workflow.Name,
        workflow.IsEnabled,
        workflow.TriggerOnSubmit,
        workflow.Steps.OrderBy(s => s.Order).Select(WorkflowStepDto.From).ToList());
}

public sealed record SubmissionAttachmentDto(Guid Id, string FileName, string? Url, string? ContentType, long Size);

public sealed record SubmissionListItemDto(
    Guid Id,
    Guid FormId,
    string Status,
    string? SubmitterName,
    string? SubmitterEmail,
    DateTime SubmittedAt,
    double SpamScore,
    string? AssignedTo);

public sealed record SubmissionDetailDto(
    Guid Id,
    Guid FormId,
    string FormTitle,
    string Status,
    string? SubmitterName,
    string? SubmitterEmail,
    string? SubmittedBy,
    DateTime SubmittedAt,
    double SpamScore,
    string? AssignedTo,
    string? ReviewNote,
    IReadOnlyDictionary<string, object?> Data,
    IReadOnlyList<SubmissionAttachmentDto> Attachments,
    IReadOnlyList<SubmissionAuditDto> Audit)
{
    public static SubmissionDetailDto From(Submission submission, string formTitle) => new(
        submission.Id,
        submission.FormId,
        formTitle,
        submission.Status.ToString(),
        submission.SubmitterName,
        submission.SubmitterEmail,
        submission.SubmittedBy,
        submission.SubmittedAt,
        submission.SpamScore,
        submission.AssignedTo,
        submission.ReviewNote,
        (IReadOnlyDictionary<string, object?>?)submission.GetData(),
        submission.Attachments.Select(a => new SubmissionAttachmentDto(a.Id, a.FileName, a.Url, a.ContentType, a.Size)).ToList(),
        submission.Audit.OrderBy(a => a.At).Select(a => new SubmissionAuditDto(a.Id, a.Action, a.PerformedBy, a.Note, a.ResultingStatus.ToString(), a.At)).ToList());
}

public sealed record SubmissionAuditDto(Guid Id, string Action, string? PerformedBy, string? Note, string ResultingStatus, DateTime At);

public sealed record ExportResultDto(string Format, int RowCount, DateTime GeneratedAt, string FileName);

using System.Collections.Generic;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Sathus.Forms.Domain.Entities;
using Sathus.Forms.Domain.Enums;
using Sathus.Forms.Domain.ValueObjects;

namespace Sathus.Forms.Application.Workflow;

/// <summary>Runs a <see cref="Workflow"/> against a submission and emits execution intents.</summary>
public interface IWorkflowEngine
{
    Task<WorkflowExecutionResult> RunAsync(
        Sathus.Forms.Domain.Entities.Workflow workflow,
        Submission submission,
        IReadOnlyDictionary<string, object?> formData,
        CancellationToken cancellationToken = default);
}

/// <summary>
/// Default workflow engine. Iterates ordered steps, honouring condition gates, and accumulates
/// notification / automation intents plus assignment and suggested status. Pure: it does not
/// dispatch anything itself; the application layer performs side effects via adapters.
/// </summary>
public sealed class DefaultWorkflowEngine : IWorkflowEngine
{
    public Task<WorkflowExecutionResult> RunAsync(
        Sathus.Forms.Domain.Entities.Workflow workflow,
        Submission submission,
        IReadOnlyDictionary<string, object?> formData,
        CancellationToken cancellationToken = default)
    {
        var result = new WorkflowExecutionResult();

        if (!workflow.IsEnabled || !workflow.TriggerOnSubmit)
        {
            return Task.FromResult(result);
        }

        foreach (var step in workflow.Steps.OrderBy(s => s.Order))
        {
            if (step.Type == WorkflowStepType.Start || step.Type == WorkflowStepType.End)
            {
                continue;
            }

            if (step.Type == WorkflowStepType.Condition)
            {
                var config = step.GetConfig();
                if (config is not null && config.TryGetValue("condition", out var raw))
                {
                    var condition = raw is string s
                        ? JsonSerializer.Deserialize<VisibilityCondition>(s)
                        : raw as VisibilityCondition;
                    if (condition is not null && !ConditionEvaluator.Evaluate(condition, formData))
                    {
                        continue;
                    }
                }
            }

            switch (step.Type)
            {
                case WorkflowStepType.Assignment:
                    var assignee = step.GetConfig()?.TryGetValue("assignee", out var a) == true ? a?.ToString() : null;
                    if (!string.IsNullOrWhiteSpace(assignee))
                    {
                        result.AssignedTo = assignee;
                        result.SuggestedStatus = SubmissionStatus.Assigned.ToString();
                    }
                    break;

                case WorkflowStepType.Approval:
                    foreach (var rule in step.ApprovalRules)
                    {
                        result.AddApprovalRole(rule.Role);
                    }

                    result.SuggestedStatus ??= SubmissionStatus.UnderReview.ToString();
                    break;

                case WorkflowStepType.Review:
                    result.SuggestedStatus ??= SubmissionStatus.UnderReview.ToString();
                    break;

                case WorkflowStepType.Notification:
                    foreach (var rule in step.NotificationRules)
                    {
                        if (rule.ConditionJson is not null)
                        {
                            var condition = JsonSerializer.Deserialize<VisibilityCondition>(rule.ConditionJson);
                            if (condition is not null && !ConditionEvaluator.Evaluate(condition, formData))
                            {
                                continue;
                            }
                        }

                        result.AddNotification(new NotificationIntent(
                            rule.Channel.ToString(),
                            rule.Recipient,
                            rule.Template,
                            JsonSerializer.Serialize(new
                            {
                                submissionId = submission.Id,
                                formId = submission.FormId,
                                submitterName = submission.SubmitterName,
                                submitterEmail = submission.SubmitterEmail
                            })));
                    }
                    break;

                case WorkflowStepType.Automation:
                    foreach (var action in step.Actions)
                    {
                        result.AddAction(new ActionIntent(action.Type.ToString(), (IReadOnlyDictionary<string, object?>?)action.GetConfig()));
                    }
                    break;
            }
        }

        return Task.FromResult(result);
    }
}

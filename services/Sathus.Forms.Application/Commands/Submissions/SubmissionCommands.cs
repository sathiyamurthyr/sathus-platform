using System.Collections.Generic;
using MediatR;
using Sathus.Forms.Application.DTOs;
using Sathus.Forms.Application.Interfaces;
using Sathus.Forms.Application.Workflow;
using Sathus.Forms.Domain.Entities;
using Sathus.Forms.Domain.Enums;
using Sathus.Forms.Domain.Exceptions;

namespace Sathus.Forms.Application.Commands.Submissions;

public sealed record SubmitFormCommand(
    Guid FormId,
    IDictionary<string, object?> Values,
    string? SubmitterName = null,
    string? SubmitterEmail = null,
    string? SubmittedBy = null,
    string? IpAddress = null,
    string? UserAgent = null,
    double SpamScore = 0,
    bool IsSpam = false,
    IReadOnlyList<SubmissionAttachmentInput>? Attachments = null,
    Guid? ActorId = null)
    : IRequest<SubmitResultDto>;

public sealed record SubmissionAttachmentInput(string FileName, string StoredAssetId, string? ContentType = null, long Size = 0, string? Url = null);

public sealed class SubmitFormCommandHandler : IRequestHandler<SubmitFormCommand, SubmitResultDto>
{
    private readonly IFormRepository _formRepository;
    private readonly ISubmissionRepository _submissionRepository;
    private readonly IWorkflowRepository _workflowRepository;
    private readonly IWorkflowEngine _workflowEngine;
    private readonly INotificationDispatcher _notificationDispatcher;

    public SubmitFormCommandHandler(
        IFormRepository formRepository,
        ISubmissionRepository submissionRepository,
        IWorkflowRepository workflowRepository,
        IWorkflowEngine workflowEngine,
        INotificationDispatcher notificationDispatcher)
    {
        _formRepository = formRepository;
        _submissionRepository = submissionRepository;
        _workflowRepository = workflowRepository;
        _workflowEngine = workflowEngine;
        _notificationDispatcher = notificationDispatcher;
    }

    public async Task<SubmitResultDto> Handle(SubmitFormCommand request, CancellationToken cancellationToken)
    {
        var form = await _formRepository.GetWithWorkflowAsync(request.FormId, cancellationToken)
            ?? throw new FormNotFoundException(request.FormId);

        if (form.PublishedVersionId is null && form.Status != FormStatus.Published)
        {
            throw new FormInvalidOperationException("Form is not published and cannot accept submissions.");
        }

        var submission = Submission.Submit(
            form.Id,
            form.PublishedVersionId,
            request.Values,
            request.SubmitterName,
            request.SubmitterEmail,
            request.SubmittedBy,
            request.IpAddress,
            request.UserAgent,
            request.SpamScore,
            request.IsSpam,
            request.ActorId);

        if (request.Attachments is not null)
        {
            foreach (var a in request.Attachments)
            {
                submission.AddAttachment(a.FileName, a.StoredAssetId, a.ContentType, a.Size, a.Url);
            }
        }

        var triggered = false;
        var workflow = await _workflowRepository.GetByFormAsync(form.Id, cancellationToken);
        if (workflow is not null)
        {
                var result = await _workflowEngine.RunAsync(workflow, submission, (IReadOnlyDictionary<string, object?>)request.Values, cancellationToken);
                foreach (var notification in result.Notifications)
                {
                    await _notificationDispatcher.DispatchAsync(notification, cancellationToken);
                }

                if (!string.IsNullOrWhiteSpace(result.AssignedTo))
                {
                    submission.Assign(result.AssignedTo, request.ActorId?.ToString());
                }
                else if (result.SuggestedStatus is not null && Enum.TryParse<SubmissionStatus>(result.SuggestedStatus, true, out var status))
                {
                    if (status == SubmissionStatus.UnderReview)
                    {
                        submission.StartReview(request.ActorId?.ToString());
                    }
                }

                triggered = result.Notifications.Count > 0 || result.Actions.Count > 0;
            }

        await _submissionRepository.AddAsync(submission, cancellationToken);
        await _submissionRepository.SaveChangesAsync(cancellationToken);

        return new SubmitResultDto(submission.Id, submission.Status.ToString(), triggered);
    }
}

public sealed record AssignSubmissionCommand(Guid SubmissionId, string AssigneeId, string? PerformedBy = null) : IRequest<Unit>;

public sealed class AssignSubmissionCommandHandler : IRequestHandler<AssignSubmissionCommand, Unit>
{
    private readonly ISubmissionRepository _repository;

    public AssignSubmissionCommandHandler(ISubmissionRepository repository) => _repository = repository;

    public async Task<Unit> Handle(AssignSubmissionCommand request, CancellationToken cancellationToken)
    {
        var submission = await _repository.GetWithDetailsAsync(request.SubmissionId, cancellationToken)
            ?? throw new SubmissionNotFoundException(request.SubmissionId);

        submission.Assign(request.AssigneeId, request.PerformedBy);
        await _repository.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

public sealed record StartReviewCommand(Guid SubmissionId, string? PerformedBy = null) : IRequest<Unit>;

public sealed class StartReviewCommandHandler : IRequestHandler<StartReviewCommand, Unit>
{
    private readonly ISubmissionRepository _repository;

    public StartReviewCommandHandler(ISubmissionRepository repository) => _repository = repository;

    public async Task<Unit> Handle(StartReviewCommand request, CancellationToken cancellationToken)
    {
        var submission = await _repository.GetWithDetailsAsync(request.SubmissionId, cancellationToken)
            ?? throw new SubmissionNotFoundException(request.SubmissionId);

        submission.StartReview(request.PerformedBy);
        await _repository.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

public sealed record ApproveSubmissionCommand(Guid SubmissionId, string? Note, string? PerformedBy = null) : IRequest<Unit>;

public sealed class ApproveSubmissionCommandHandler : IRequestHandler<ApproveSubmissionCommand, Unit>
{
    private readonly ISubmissionRepository _repository;

    public ApproveSubmissionCommandHandler(ISubmissionRepository repository) => _repository = repository;

    public async Task<Unit> Handle(ApproveSubmissionCommand request, CancellationToken cancellationToken)
    {
        var submission = await _repository.GetWithDetailsAsync(request.SubmissionId, cancellationToken)
            ?? throw new SubmissionNotFoundException(request.SubmissionId);

        submission.Approve(request.Note, request.PerformedBy);
        await _repository.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

public sealed record RejectSubmissionCommand(Guid SubmissionId, string? Note, string? PerformedBy = null) : IRequest<Unit>;

public sealed class RejectSubmissionCommandHandler : IRequestHandler<RejectSubmissionCommand, Unit>
{
    private readonly ISubmissionRepository _repository;

    public RejectSubmissionCommandHandler(ISubmissionRepository repository) => _repository = repository;

    public async Task<Unit> Handle(RejectSubmissionCommand request, CancellationToken cancellationToken)
    {
        var submission = await _repository.GetWithDetailsAsync(request.SubmissionId, cancellationToken)
            ?? throw new SubmissionNotFoundException(request.SubmissionId);

        submission.Reject(request.Note, request.PerformedBy);
        await _repository.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

public sealed record EscalateSubmissionCommand(Guid SubmissionId, string? Note, string? PerformedBy = null) : IRequest<Unit>;

public sealed class EscalateSubmissionCommandHandler : IRequestHandler<EscalateSubmissionCommand, Unit>
{
    private readonly ISubmissionRepository _repository;

    public EscalateSubmissionCommandHandler(ISubmissionRepository repository) => _repository = repository;

    public async Task<Unit> Handle(EscalateSubmissionCommand request, CancellationToken cancellationToken)
    {
        var submission = await _repository.GetWithDetailsAsync(request.SubmissionId, cancellationToken)
            ?? throw new SubmissionNotFoundException(request.SubmissionId);

        submission.Escalate(request.Note, request.PerformedBy);
        await _repository.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

public sealed record CompleteSubmissionCommand(Guid SubmissionId, string? PerformedBy = null) : IRequest<Unit>;

public sealed class CompleteSubmissionCommandHandler : IRequestHandler<CompleteSubmissionCommand, Unit>
{
    private readonly ISubmissionRepository _repository;

    public CompleteSubmissionCommandHandler(ISubmissionRepository repository) => _repository = repository;

    public async Task<Unit> Handle(CompleteSubmissionCommand request, CancellationToken cancellationToken)
    {
        var submission = await _repository.GetWithDetailsAsync(request.SubmissionId, cancellationToken)
            ?? throw new SubmissionNotFoundException(request.SubmissionId);

        submission.Complete(request.PerformedBy);
        await _repository.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

public sealed record MarkSpamCommand(Guid SubmissionId, string? PerformedBy = null) : IRequest<Unit>;

public sealed class MarkSpamCommandHandler : IRequestHandler<MarkSpamCommand, Unit>
{
    private readonly ISubmissionRepository _repository;

    public MarkSpamCommandHandler(ISubmissionRepository repository) => _repository = repository;

    public async Task<Unit> Handle(MarkSpamCommand request, CancellationToken cancellationToken)
    {
        var submission = await _repository.GetWithDetailsAsync(request.SubmissionId, cancellationToken)
            ?? throw new SubmissionNotFoundException(request.SubmissionId);

        submission.MarkSpam(request.PerformedBy);
        await _repository.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

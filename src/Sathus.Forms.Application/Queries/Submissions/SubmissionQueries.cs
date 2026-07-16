using MediatR;
using Sathus.Forms.Application.DTOs;
using Sathus.Forms.Application.Interfaces;
using Sathus.Forms.Domain.Entities;
using Sathus.Forms.Domain.Enums;
using Sathus.Forms.Domain.Exceptions;
using Sathus.SharedKernel.Paging;

namespace Sathus.Forms.Application.Queries.Submissions;

public sealed record ListSubmissionsQuery(
    Guid FormId,
    string? Status = null,
    string? SubmitterEmail = null,
    string? Search = null,
    bool? IsSpam = null,
    DateTime? From = null,
    DateTime? To = null,
    int Page = 1,
    int PageSize = 25)
    : IRequest<PagedResult<SubmissionListItemDto>>;

public sealed class ListSubmissionsQueryHandler : IRequestHandler<ListSubmissionsQuery, PagedResult<SubmissionListItemDto>>
{
    private readonly ISubmissionRepository _repository;

    public ListSubmissionsQueryHandler(ISubmissionRepository repository) => _repository = repository;

    public async Task<PagedResult<SubmissionListItemDto>> Handle(ListSubmissionsQuery request, CancellationToken cancellationToken)
    {
        var filter = new SubmissionFilter
        {
            Status = request.Status,
            SubmitterEmail = request.SubmitterEmail,
            Search = request.Search,
            IsSpam = request.IsSpam,
            From = request.From,
            To = request.To,
            Page = request.Page,
            PageSize = request.PageSize
        };

        var items = await _repository.ListByFormAsync(request.FormId, filter, cancellationToken);
        var total = await _repository.CountByFormAsync(request.FormId, cancellationToken);

        var dtos = items.Select(s => new SubmissionListItemDto(
            s.Id, s.FormId, s.Status.ToString(), s.SubmitterName, s.SubmitterEmail, s.SubmittedAt, s.SpamScore, s.AssignedTo)).ToList();

        return new PagedResult<SubmissionListItemDto>(dtos, request.Page, request.PageSize, total);
    }
}

public sealed record GetSubmissionQuery(Guid Id) : IRequest<SubmissionDetailDto>;

public sealed class GetSubmissionQueryHandler : IRequestHandler<GetSubmissionQuery, SubmissionDetailDto>
{
    private readonly ISubmissionRepository _repository;
    private readonly IFormRepository _formRepository;

    public GetSubmissionQueryHandler(ISubmissionRepository repository, IFormRepository formRepository)
    {
        _repository = repository;
        _formRepository = formRepository;
    }

    public async Task<SubmissionDetailDto> Handle(GetSubmissionQuery request, CancellationToken cancellationToken)
    {
        var submission = await _repository.GetWithDetailsAsync(request.Id, cancellationToken)
            ?? throw new SubmissionNotFoundException(request.Id);

        var form = await _formRepository.GetWithStructureAsync(submission.FormId, cancellationToken);
        return SubmissionDetailDto.From(submission, form?.Title ?? "Unknown");
    }
}

public sealed record ExportSubmissionsQuery(Guid FormId, string Format = "Csv") : IRequest<ExportResultDto>;

public sealed class ExportSubmissionsQueryHandler : IRequestHandler<ExportSubmissionsQuery, ExportResultDto>
{
    private readonly ISubmissionRepository _repository;

    public ExportSubmissionsQueryHandler(ISubmissionRepository repository) => _repository = repository;

    public async Task<ExportResultDto> Handle(ExportSubmissionsQuery request, CancellationToken cancellationToken)
    {
        var items = await _repository.ListByFormAsync(request.FormId, new SubmissionFilter { PageSize = int.MaxValue }, cancellationToken);
        return new ExportResultDto(request.Format, items.Count, DateTime.UtcNow, $"form-{request.FormId}-export.{request.Format.ToLowerInvariant()}");
    }
}

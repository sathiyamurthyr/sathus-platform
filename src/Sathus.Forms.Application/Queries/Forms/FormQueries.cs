using MediatR;
using Sathus.Forms.Application.DTOs;
using Sathus.Forms.Application.Interfaces;
using Sathus.Forms.Domain.Exceptions;

namespace Sathus.Forms.Application.Queries.Forms;

public sealed record ListFormsQuery(string? Category = null, string? Status = null, string? Search = null, int Page = 1, int PageSize = 25)
    : IRequest<IReadOnlyList<FormSummaryDto>>;

public sealed class ListFormsQueryHandler : IRequestHandler<ListFormsQuery, IReadOnlyList<FormSummaryDto>>
{
    private readonly IFormRepository _repository;

    public ListFormsQueryHandler(IFormRepository repository) => _repository = repository;

    public async Task<IReadOnlyList<FormSummaryDto>> Handle(ListFormsQuery request, CancellationToken cancellationToken)
    {
        var forms = await _repository.ListAsync(new FormFilter
        {
            Category = request.Category,
            Status = request.Status,
            Search = request.Search,
            Page = request.Page,
            PageSize = request.PageSize
        }, cancellationToken);

        var result = new List<FormSummaryDto>();
        foreach (var form in forms)
        {
            result.Add(new FormSummaryDto(
                form.Id, form.Key, form.Title, form.Category, form.Status.ToString(),
                form.Versions.FirstOrDefault(v => v.Id == form.CurrentVersionId)?.VersionNumber,
                form.PublishedVersionId, form.Sections.Count, form.Sections.Sum(s => s.Fields.Count),
                await _repository.CountSubmissionsAsync(form.Id, cancellationToken), form.UpdatedAt));
        }

        return result;
    }
}

public sealed record GetFormQuery(Guid Id) : IRequest<FormDetailDto>;

public sealed class GetFormQueryHandler : IRequestHandler<GetFormQuery, FormDetailDto>
{
    private readonly IFormRepository _formRepository;
    private readonly IWorkflowRepository _workflowRepository;

    public GetFormQueryHandler(IFormRepository formRepository, IWorkflowRepository workflowRepository)
    {
        _formRepository = formRepository;
        _workflowRepository = workflowRepository;
    }

    public async Task<FormDetailDto> Handle(GetFormQuery request, CancellationToken cancellationToken)
    {
        var form = await _formRepository.GetWithStructureAsync(request.Id, cancellationToken)
            ?? throw new FormNotFoundException(request.Id);

        var workflow = await _workflowRepository.GetByFormAsync(form.Id, cancellationToken);

        return new FormDetailDto(
            form.Id, form.Key, form.Title, form.Description, form.Category, form.Status.ToString(),
            form.CurrentVersionId, form.PublishedVersionId,
            form.Sections.OrderBy(s => s.Order).Select(FormSectionDto.From).ToList(),
            form.Versions.OrderByDescending(v => v.VersionNumber)
                .Select(v => new FormVersionDto(v.Id, v.VersionNumber, v.Label, v.Status.ToString(), v.IsCurrent, v.PublishedAt, v.CreatedAt)).ToList(),
            workflow is null ? null : WorkflowDto.From(workflow),
            await _formRepository.CountSubmissionsAsync(form.Id, cancellationToken),
            form.CreatedAt, form.UpdatedAt);
    }
}

public sealed record GetFormVersionsQuery(Guid Id) : IRequest<IReadOnlyList<FormVersionDto>>;

public sealed class GetFormVersionsQueryHandler : IRequestHandler<GetFormVersionsQuery, IReadOnlyList<FormVersionDto>>
{
    private readonly IFormRepository _repository;

    public GetFormVersionsQueryHandler(IFormRepository repository) => _repository = repository;

    public async Task<IReadOnlyList<FormVersionDto>> Handle(GetFormVersionsQuery request, CancellationToken cancellationToken)
    {
        var form = await _repository.GetWithStructureAsync(request.Id, cancellationToken)
            ?? throw new FormNotFoundException(request.Id);

        return form.Versions.OrderByDescending(v => v.VersionNumber)
            .Select(v => new FormVersionDto(v.Id, v.VersionNumber, v.Label, v.Status.ToString(), v.IsCurrent, v.PublishedAt, v.CreatedAt))
            .ToList();
    }
}

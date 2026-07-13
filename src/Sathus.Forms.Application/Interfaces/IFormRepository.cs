using Sathus.Forms.Domain.Entities;
using Sathus.SharedKernel.Repositories;

namespace Sathus.Forms.Application.Interfaces;

/// <summary>Repository for forms, including their live builder structure, versions and workflow.</summary>
public interface IFormRepository : IRepository<Form>
{
    Task<Form?> GetWithStructureAsync(Guid id, CancellationToken cancellationToken = default);

    Task<Form?> GetByKeyAsync(string key, CancellationToken cancellationToken = default);

    Task<Form?> GetWithWorkflowAsync(Guid id, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Form>> ListAsync(FormFilter filter, CancellationToken cancellationToken = default);

    Task<int> CountSubmissionsAsync(Guid formId, CancellationToken cancellationToken = default);
}

/// <summary>Filter used when listing forms.</summary>
public sealed class FormFilter
{
    public string? Category { get; init; }
    public string? Status { get; init; }
    public string? Search { get; init; }
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 25;
}

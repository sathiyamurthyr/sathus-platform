using Sathus.Forms.Domain.Entities;
using Sathus.Forms.Domain.Enums;
using Sathus.SharedKernel.Repositories;

namespace Sathus.Forms.Application.Interfaces;

/// <summary>Repository for form submissions, including attachments and audit history.</summary>
public interface ISubmissionRepository : IRepository<Submission>
{
    Task<Submission?> GetWithDetailsAsync(Guid id, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Submission>> ListByFormAsync(Guid formId, SubmissionFilter filter, CancellationToken cancellationToken = default);

    Task<int> CountByFormAsync(Guid formId, CancellationToken cancellationToken = default);
}

/// <summary>Filter used when listing submissions.</summary>
public sealed class SubmissionFilter
{
    public string? Status { get; init; }
    public string? SubmitterEmail { get; init; }
    public string? Search { get; init; }
    public bool? IsSpam { get; init; }
    public DateTime? From { get; init; }
    public DateTime? To { get; init; }
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 25;
}

public static class SubmissionFilterExtensions
{
    public static bool HasStatus(this SubmissionFilter filter, SubmissionStatus status) =>
        Enum.TryParse<SubmissionStatus>(filter.Status, ignoreCase: true, out var parsed) && parsed == status;
}

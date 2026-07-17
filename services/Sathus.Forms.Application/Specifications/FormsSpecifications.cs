using Sathus.Forms.Application.Interfaces;
using Sathus.Forms.Domain.Entities;
using Sathus.Forms.Domain.Enums;
using Sathus.SharedKernel.Specifications;

namespace Sathus.Forms.Application.Specifications;

public sealed class FormFilterSpecification : Specification<Form>
{
    public FormFilterSpecification(FormFilter filter)
    {
        if (!string.IsNullOrWhiteSpace(filter.Category))
        {
            AddCriteria(f => f.Category == filter.Category);
        }

        if (!string.IsNullOrWhiteSpace(filter.Status) && Enum.TryParse<FormStatus>(filter.Status, ignoreCase: true, out var status))
        {
            AddCriteria(f => f.Status == status);
        }

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var term = filter.Search.ToLowerInvariant();
            AddCriteria(f => f.Title.ToLower().Contains(term) || f.Key.ToLower().Contains(term));
        }

        ApplyOrderByDescending(f => f.UpdatedAt);
        ApplyPaging((filter.Page - 1) * filter.PageSize, filter.PageSize);
    }
}

public sealed class SubmissionFilterSpecification : Specification<Submission>
{
    public SubmissionFilterSpecification(Guid formId, SubmissionFilter filter)
    {
        AddCriteria(s => s.FormId == formId);

        if (!string.IsNullOrWhiteSpace(filter.Status) && Enum.TryParse<SubmissionStatus>(filter.Status, ignoreCase: true, out var status))
        {
            AddCriteria(s => s.Status == status);
        }

        if (!string.IsNullOrWhiteSpace(filter.SubmitterEmail))
        {
            AddCriteria(s => s.SubmitterEmail != null && s.SubmitterEmail.ToLower() == filter.SubmitterEmail.ToLower());
        }

        if (filter.IsSpam.HasValue)
        {
            AddCriteria(s => (s.Status == SubmissionStatus.Spam) == filter.IsSpam.Value);
        }

        if (filter.From.HasValue)
        {
            AddCriteria(s => s.SubmittedAt >= filter.From.Value);
        }

        if (filter.To.HasValue)
        {
            AddCriteria(s => s.SubmittedAt <= filter.To.Value);
        }

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var term = filter.Search.ToLowerInvariant();
            AddCriteria(s => (s.SubmitterName != null && s.SubmitterName.ToLower().Contains(term))
                || (s.SubmitterEmail != null && s.SubmitterEmail.ToLower().Contains(term)));
        }

        ApplyOrderByDescending(s => s.SubmittedAt);
        ApplyPaging((filter.Page - 1) * filter.PageSize, filter.PageSize);
    }
}

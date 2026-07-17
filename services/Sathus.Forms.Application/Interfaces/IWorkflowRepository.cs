using Sathus.Forms.Domain.Entities;
using Sathus.SharedKernel.Repositories;

namespace Sathus.Forms.Application.Interfaces;

/// <summary>Repository for workflows attached to forms.</summary>
public interface IWorkflowRepository : IRepository<Sathus.Forms.Domain.Entities.Workflow>
{
    Task<Sathus.Forms.Domain.Entities.Workflow?> GetByFormAsync(Guid formId, CancellationToken cancellationToken = default);
}

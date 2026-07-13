using MediatR;
using Sathus.MediaRelations.Application.DTOs;
using Sathus.SharedKernel.Paging;

namespace Sathus.MediaRelations.Application.Queries.GetBrokenReferences;

/// <summary>Returns broken references (paged) for remediation.</summary>
public sealed record GetBrokenReferencesQuery(int Page = 1, int PageSize = 50)
    : IRequest<PagedResult<MediaReferenceResponse>>;

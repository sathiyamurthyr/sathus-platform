using System.Linq.Expressions;
using Sathus.Processing.Domain.Entities;
using Sathus.SharedKernel.Specifications;

namespace Sathus.Processing.Application.Specifications;

public sealed class AssetProcessingJobSpecifications
{
    public sealed class ByAsset : Specification<AssetProcessingJob>
    {
        public ByAsset(Guid assetId) => AddCriteria(j => j.AssetId == assetId);
    }

    public sealed class ByStatus : Specification<AssetProcessingJob>
    {
        public ByStatus(ProcessingStatus status) => AddCriteria(j => j.Status == status);
    }

    public sealed class ByStatusAndMediaType : Specification<AssetProcessingJob>
    {
        public ByStatusAndMediaType(ProcessingStatus? status, string? mediaType)
        {
            Expression<Func<AssetProcessingJob, bool>> criteria = j => true;
            if (status.HasValue)
            {
                criteria = criteria.AndAlso(j => j.Status == status.Value);
            }

            if (!string.IsNullOrWhiteSpace(mediaType))
            {
                criteria = criteria.AndAlso(j => j.MediaTypeValue == mediaType!);
            }

            AddCriteria(criteria);
        }
    }

    public sealed class PagedByStatusAndMediaType : Specification<AssetProcessingJob>
    {
        public PagedByStatusAndMediaType(ProcessingStatus? status, string? mediaType, int page, int pageSize)
        {
            Expression<Func<AssetProcessingJob, bool>> criteria = j => true;
            if (status.HasValue)
            {
                criteria = criteria.AndAlso(j => j.Status == status.Value);
            }

            if (!string.IsNullOrWhiteSpace(mediaType))
            {
                criteria = criteria.AndAlso(j => j.MediaTypeValue == mediaType!);
            }

            AddCriteria(criteria);
            ApplyOrderByDescending(j => j.CreatedAt);
            ApplyPaging((page - 1) * pageSize, pageSize);
        }
    }
}

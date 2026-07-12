using Sathus.Upload.Domain.Entities;

namespace Sathus.Upload.Application.Interfaces;

public interface IMetadataExtractionService
{
    Task<Dictionary<string, string>> ExtractAsync(UploadSession session, Stream stream, CancellationToken cancellationToken = default);
}

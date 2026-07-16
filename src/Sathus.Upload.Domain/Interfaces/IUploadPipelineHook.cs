using Sathus.Upload.Domain.Entities;

namespace Sathus.Upload.Domain.Interfaces;

public interface IUploadPipelineHook
{
    string Name { get; }
    Task<bool> ExecuteAsync(UploadSession session, CancellationToken cancellationToken = default);
}

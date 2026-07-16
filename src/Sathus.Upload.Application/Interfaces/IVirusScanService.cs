using Sathus.Upload.Domain.Entities;

namespace Sathus.Upload.Application.Interfaces;

public interface IVirusScanService
{
    Task<bool> ScanAsync(UploadSession session, Stream stream, CancellationToken cancellationToken = default);
}

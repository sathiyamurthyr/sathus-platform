using Sathus.Upload.Domain.Entities;

namespace Sathus.Upload.Application.Interfaces;

public interface IUploadValidator
{
    Task ValidateAsync(UploadSession session, CancellationToken cancellationToken = default);
}

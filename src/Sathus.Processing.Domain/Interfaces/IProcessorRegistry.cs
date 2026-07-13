using Sathus.Media.Domain.ValueObjects;

namespace Sathus.Processing.Domain.Interfaces;

/// <summary>
/// Resolves the appropriate <see cref="IAssetProcessor"/> for a media type.
/// Implemented in the infrastructure layer and populated from DI.
/// </summary>
public interface IProcessorRegistry
{
    IAssetProcessor? Resolve(MediaType mediaType);

    IReadOnlyList<IAssetProcessor> GetAll();
}
